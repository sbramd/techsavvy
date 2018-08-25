import React from "react";
import { Loader } from "..";
import { MapPin, Mail, Phone } from "react-feather";
import { exportBreakpoint } from "utils";

export class Contact extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			fullName: "",
			subject: "",
			message: "",
			errorInputIndex: -1,
			errorInputMessage: "",
			isLoading: false,
			windowWidth: window.innerWidth
		};
	}

	_handleResize = e => {
		this.setState({
			windowHeight: window.innerHeight,
			windowWidth: window.innerWidth
		});
	};

	componentDidMount = () => {
		window.addEventListener("resize", this._handleResize);
	};

	componentWillUnmount = () => {
		window.removeEventListener("resize", this._handleResize);
	};

	_handleFormSubmit = event => {
		event.preventDefault();
		this.setState(
			{
				isLoading: true
			},
			() => console.log(this.state)
		);
	};

	_renderContactForm = () => {
		const { isLoading, email, fullName, subject, message, windowWidth } = this.state;
		let props = {};
		if (windowWidth >= exportBreakpoint("desktop").max) {
			props = {
				style: { paddingLeft: (windowWidth - exportBreakpoint("desktop").max) / 2 }
			};
		}

		return (
			<div id="contact-form" className="column _65">
				<form name="contact-form" onSubmit={this._handleFormSubmit} {...props}>
					<fieldset>
						<legend>Get in touch</legend>
						<div className="contact-form-inputs-wrapper">
							<div className="contact-form-input-wrapper">
								<input
									type="text"
									name="full-name"
									id="full-name"
									className="txt-input"
									placeholder="full name"
									autoComplete="off"
									required
									value={fullName}
									onChange={event => this.setState({ fullName: event.target.value })}
								/>
								{/* {this.state.errorInputIndex === 0 && <span>Please enter your full name</span>} */}
							</div>
							<div className="contact-form-input-wrapper">
								<input
									type="email"
									name="email"
									id="email"
									className="txt-input"
									placeholder="email"
									autoComplete="off"
									required
									value={email}
									onChange={event => this.setState({ email: event.target.value })}
								/>
								{/* {this.state.errorInputIndex === 1 && <span>Please enter a valid email address</span>} */}
							</div>
						</div>
						<div className="contact-form-input-wrapper">
							<input
								type="text"
								name="subject"
								id="subject"
								className="txt-input"
								placeholder="subject"
								autoComplete="off"
								required
								value={subject}
								onChange={event => this.setState({ subject: event.target.value })}
							/>
							{/* {this.state.errorInputIndex === 2 && <span>Please enter your subject</span>} */}
						</div>
						<div className="contact-form-input-wrapper">
							<textarea
								className="txt-area inverse"
								id="message"
								name="message"
								value={message}
								placeholder="message"
								required
								onChange={event => this.setState({ message: event.target.value })}
							/>
							{this.state.errorInputIndex === 3 && <span>{this.state.errorInputMessage}</span>}
						</div>
					</fieldset>
					<div className="contact-form-btn-wrapper">
						{isLoading ? (
							<div className="contact-form-loader-wrapper">
								<Loader />
							</div>
						) : (
							<input type="submit" className="btn" value="save" />
						)}
					</div>
				</form>
			</div>
		);
	};

	_renderContactInfo = () => {
		const items = [
			{
				icon: MapPin,
				titles: ["124 Conch Street", "Bikini Bottom", "Pacific Ocean"]
			},
			{ icon: Mail, titles: ["trickster0179@gmail.com"] },
			{ icon: Phone, titles: ["+880 1557-021521"] }
		];
		let props = {},
			{ windowWidth } = this.state;
		if (windowWidth >= exportBreakpoint("desktop").max) {
			props = {
				style: { paddingRight: (windowWidth - exportBreakpoint("desktop").max) / 2 }
			};
		}

		return (
			<article className="column _35 contact-info-wrapper">
				<div {...props}>
					<h2>contact information</h2>
					<ul className="contact-info-list">
						{items.map((item, itemKey) => {
							const Icon = item["icon"];
							return (
								<li key={itemKey} className="contact-info-item">
									<Icon className="contact-info-item-icon" />
									<hgroup>{item.titles.map((title, titleKey) => <h4 key={titleKey}>{title}</h4>)}</hgroup>
								</li>
							);
						})}
					</ul>
				</div>
			</article>
		);
	};

	render = () => (
		<div className="contact-content">
			<div className="container">
				<section className="row">
					{this._renderContactForm()}
					{this._renderContactInfo()}
				</section>
			</div>
		</div>
	);
}