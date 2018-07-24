import React from "react";
import { Link } from "react-router-dom";
import { iconCaution } from "../assets";

export const NoMatch = ({ location }) => (
	<article className="no-match-content">
		<div className="no-match-img-wrapper">
			<img src={iconCaution} alt="no-match graphic" id="no-match-graphic" />
		</div>
		<div className="no-match-message-wrapper">
			<hgroup>
				<h1>404 error</h1>
				{/* <h3>No match for <code>{location.pathname}</code></h3> */}
				<h3 className="no-match-message">Oops! This page does not exist.</h3>
			</hgroup>
			<Link className="btn" to="/">
				go back
			</Link>
		</div>
	</article>
);
