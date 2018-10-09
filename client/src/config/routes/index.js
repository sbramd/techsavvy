import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { NotFoundScreen, HomeScreen, AboutScreen, ContactScreen, LicenseScreen } from "screens";
import { ErrorBoundary } from "components";
import Articles from "./articleRoutes";
import Users from "./userRoutes";
import AppProvider from "../../AppProvider";

const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props =>
			JSON.parse(localStorage.getItem("user")) ? (
				<Component {...props} />
			) : (
				<Redirect
					to={{ pathname: "/", state: { isModalOpen: true, from: props.location, offsetTop: window.pageYOffset } }}
				/>
			)
		}
	/>
);

const ContextRoute = ({ contextComponent, component, ...rest }) => {
	const Provider = contextComponent,
		Component = component;
	return (
		<Route
			{...rest}
			render={props => (
				<Provider>
					<Component {...props} />
				</Provider>
			)}
		/>
	);
};

export const _renderRoutes = () => (
	<Route
		render={({ location, history }) => (
			<TransitionGroup>
				<CSSTransition key={location.pathname} classNames="fade" timeout={{ enter: 500, exit: 300 }} unmountOnExit>
					<ErrorBoundary hasError location={location} history={history}>
						<Switch
						// location={location}
						>
							<Route exact path="/" component={HomeScreen} />
							<ContextRoute exact path="/about" contextComponent={AppProvider} component={AboutScreen} />
							<Route exact path="/contact" component={ContactScreen} />
							<Route exact path="/license" component={LicenseScreen} />
							<PrivateRoute path="/blog" component={Articles} />
							<PrivateRoute path="/user" component={Users} />
							<Route component={NotFoundScreen} />
						</Switch>
					</ErrorBoundary>
				</CSSTransition>
			</TransitionGroup>
		)}
	/>
);
