import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import {
	Menu,
	User,
	// Settings,
	Power
} from "react-feather";
import { UserFormScreen } from "screens";
import { Loader, LazyLoad } from "components";
import { Dropdown } from "..";
import { iconMale } from "assets";
import { CombinedContextConsumer, exportBreakpoint, parseQueryString } from "utils";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import actions from "redux/actions";
import _ from "lodash";

const links = [
	{
		name: "home",
		path: "/"
	},
	{
		name: "blog",
		path: "/blog"
	},
	{
		name: "about",
		path: "/about"
	},
	{
		name: "contact",
		path: "/contact"
	}
];

class Header extends Component {
	static propTypes = {
		match: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		history: PropTypes.object.isRequired
	};

	constructor(props) {
		super(props);
		this.state = {
			isMenuVisible: false,
			isModalOpen: false,
			isDropdownActive: false
		};
		this.mounted = false;
	}

	componentDidMount = () => {
		if (this.props.location.pathname === "/login") {
			if (JSON.parse(localStorage.getItem("user"))) this.props.history.goBack();
			else this.setState({ isModalOpen: true });
		}
		this.mounted = true;
	};

	componentWillMount = () => {
		const user = JSON.parse(localStorage.getItem("user")),
			userData = this.props.user;
		if (user && user.token && Object.keys(userData).length === 0) this.props.getOne({ id: "self" });
	};

	componentWillUnmount = () => {
		this.mounted = false;
	};

	componentWillReceiveProps = nextProps => {
		const isSessionExpired = nextProps.logoutData.message === "Session expired";
		if (Object.keys(this.props.user).length && Object.keys(nextProps.user).length === 0 && isSessionExpired) {
			if (nextProps.location.pathname.includes("/blog") || nextProps.location.pathname.includes("/user")) {
				this.props.history.push({
					pathname: "/login",
					search: `?redirect=${nextProps.location.pathname.substring(1)}`
				});
			}
		}
		if (
			this.props.location.pathname !== nextProps.location.pathname &&
			// this.props.location.pathname !== "/login" &&
			!this.props.isPushingHistory
		) {
			let { pathname } = this.props.location,
				offsetTop = window.pageYOffset;
			if (nextProps.location.pathname === "/login") {
				offsetTop = null;
				if (JSON.parse(localStorage.getItem("user"))) this.props.history.goBack();
				else this.setState({ isModalOpen: true });
			}
			this.props.pushHistory({ from: pathname, ...(offsetTop ? { offsetTop } : {}) });
		}
	};

	_toggleMenu = () => {
		if (this.mounted) this.setState({ isMenuVisible: !this.state.isMenuVisible });
	};

	// _toggleModal = () => {
	// 	if (this.mounted) this.setState({
	// 		isModalOpen: !this.state.isModalOpen
	// 	});
	// };

	_handleModalClickIn = () => {
		if (this.mounted)
			this.setState({
				isModalOpen: true
			});
	};

	_handleModalClickOut = shouldRedirect => {
		if (this.mounted)
			this.setState(
				{
					isModalOpen: false
				},
				() => {
					const { from, location, history } = this.props;
					if (location.pathname === "/login") {
						// console.log(shouldRedirect, from.length);
						if (shouldRedirect === true) {
							const values = parseQueryString(this.props.location.search);
							history.push(_.isEmpty(values) ? "/" : values.redirect);
						} else if (from.length) {
							history.goBack();
						} else {
							history.push("/");
						}
					}
				}
			);
	};

	_handleDropdownClick = () => {
		if (this.mounted) this.setState({ isDropdownActive: !this.state.isDropdownActive });
	};

	_renderDropdownContent = (user, isLoading) => {
		if (isLoading)
			return (
				<CombinedContextConsumer>
					{({ context }) => (
						<div className={`header-dropdown-wrapper ${context.offsetTop > 100 ? "shrink" : ""}`}>
							<Loader inverse={context.offsetTop <= 100} />
						</div>
					)}
				</CombinedContextConsumer>
			);
		return (
			<CombinedContextConsumer>
				{({ context, preferredLocale, langs }) => (
					<div className={`header-dropdown-wrapper ${context.offsetTop > 100 ? "shrink" : ""}`}>
						<span className={`${context.offsetTop > 100 ? "shrink" : ""}`}>
							{Object.keys(user).length ? user.name.toLowerCase() : langs[preferredLocale].header["auth"]}
						</span>
						<div
							className={`header-dropdown-img-wrapper ${context.offsetTop > 100 ? "shrink" : ""}`}
							onClick={Object.keys(user).length ? this._handleDropdownClick : this._handleModalClickIn}
						>
							<LazyLoad
								src={Object.keys(user).length && user.image_url ? user.image_url : iconMale}
								alt="Header infographic"
								className="header-thumbnail"
								defaultImage={iconMale}
							/>
							<div className="header-dropdown-img-overlay" />
						</div>
						{JSON.stringify(user) !== "{}" &&
							this.state.isDropdownActive && (
								<Dropdown
									shouldDropdownShrink={context.offsetTop > 100}
									items={[
										{
											icon: User,
											title: langs[preferredLocale].header.dropdown["profile"],
											isLoadingSelf: false,
											isLoadingSibling: this.props.isLoadingLogout,
											onClick: () => {
												if (this.mounted)
													this.setState({ isDropdownActive: false }, () => {
														if (this.props.location.pathname !== `/user/${user._id}`)
															this.props.history.push(`/user/${user._id}`);
													});
											}
										},
										// {
										// 	icon: Settings,
										// 	title: "Settings",
										// 	isLoadingSelf: false,
										// 	isLoadingSibling: this.props.isLoadingLogout,
										// 	onClick: () => {
										// 		if (this.mounted) this.setState({ isDropdownActive: false });
										// 	}
										// },
										{
											icon: Power,
											title: langs[preferredLocale].header.dropdown["sign_out"],
											isLoadingSelf: this.props.isLoadingLogout,
											isLoadingSibling: false,
											onClick: this._handleLogout
										}
									]}
								/>
							)}
					</div>
				)}
			</CombinedContextConsumer>
		);
	};

	_handleLogout = () => {
		this.props.logout(() => {
			if (this.mounted)
				this.setState({ isDropdownActive: false }, () => {
					this.props.clearUser();
					if (this.props.location.pathname.includes("/blog") || this.props.location.pathname.includes("/user"))
						this.props.history.push("/");
				});
		});
	};

	render = () => {
		const { location, user = {}, isLoadingUser } = this.props;
		return (
			<CombinedContextConsumer>
				{({ context, preferredLocale, langs }) => (
					<div
						className={`header-content ${context.offsetTop > 100 ? "shrink" : ""}${
							location.pathname === "/" ? " transparent" : ""
						}`}
					>
						<div className={`header-status-wrapper ${context.isOnline ? "" : "offline"}`}>
							<p>{langs[preferredLocale].header.status}</p>
						</div>
						<header className={`header-wrapper ${context.offsetTop > 100 ? "shrink" : ""}`}>
							<figure className={`header-logo-wrapper ${context.offsetTop > 100 ? "shrink" : ""}`}>
								<div className="header-icon-wrapper">
									<Menu
										className={`header-icon ${context.offsetTop > 100 ? "shrink" : ""}`}
										onClick={this._toggleMenu}
									/>
								</div>
								<figcaption className={`header-logo ${context.offsetTop > 100 ? "shrink" : ""}`}>
									{langs[preferredLocale].header.title}
								</figcaption>
								{this._renderDropdownContent(user)}
							</figure>
							<nav
								className={`${this.state.isMenuVisible && "collapse"} ${
									context.offsetTop > 100 && this.state.isMenuVisible ? "shrink" : ""
								} header-nav`}
							>
								{links.map((obj, i) => {
									let props = {};
									if (context.windowWidth <= exportBreakpoint("tablet").max)
										props = {
											onClick: e => {
												this._toggleMenu();
												if (location.pathname === obj.path) e.preventDefault();
											}
										};
									else
										props = {
											onClick: e => {
												if (location.pathname === obj.path) e.preventDefault();
											}
										};
									return (
										<Link
											to={{
												pathname: obj.path
											}}
											key={i}
											className={`header-link ${context.offsetTop > 100 ? "shrink" : ""}`}
											{...props}
										>
											{langs[preferredLocale].header.links[obj.name]}
										</Link>
									);
								})}
							</nav>
							{this._renderDropdownContent(user, isLoadingUser)}
							<UserFormScreen showModal={this.state.isModalOpen} onClose={this._handleModalClickOut} />
						</header>
					</div>
				)}
			</CombinedContextConsumer>
		);
	};
}

const mapStateToProps = ({ articles, users, authentication, history }) => ({
		isFetchingArticles: articles.isFetchingArticles,

		isFetchingUsers: users.isLoadingUsers,
		user: authentication.user,
		isLoadingUser: authentication.isLoadingUser,
		hasErroredUser: authentication.hasErroredUser,
		userError: authentication.userError,

		isLoadingLogout: authentication.isLoadingLogout,
		logoutData: authentication.logoutData,
		hasErroredLogout: authentication.hasErroredLogout,
		logoutError: authentication.logoutError,

		isModalOpen: history.isModalOpen,
		from: history.from,
		offsetTop: history.offsetTop,
		isPushingHistory: history.isPushingHistory
	}),
	mapDispatchToProps = dispatch =>
		bindActionCreators(
			{
				getOne: actions.authentication.getOne,
				logout: actions.authentication.logout,
				clearUser: () => dispatch => {
					dispatch({ type: "CLEAR_ONE" });
					dispatch({ type: "CLEAR_SELF" });
				},
				pushHistory: actions.history.pushHistory,
				clearHistory: actions.history.clear
			},
			dispatch
		);

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Header)
);
