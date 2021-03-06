import React, { Component } from "react";
import { NotFound } from "../components";

export class NotFoundScreen extends Component {
	componentWillMount = () => {
		window.scrollTo(0, 0);
	};

	render = () => {
		return <NotFound {...this.props} />;
	};
}
