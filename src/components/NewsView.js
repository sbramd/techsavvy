import React, { Component } from "react";
// import { Link } from "react-router-dom";

export class NewsView extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render = () => {
		const { data } = this.props;
		// console.log(data.thumbnail);
		return (
			<div className="wrapper">
				<div className="news-masthead">
					<figure
						className="news-featured-image"
						style={{
							backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, .3), rgba(0, 0, 0, 0.1)),
			url("${data.featured_image_url}")`
						}}
					/>
				</div>
				<div className="news-view-content">
					<div className="container">
						<section className="row">
							<article className="column">
								<header className="news-info-wrapper">
									<span>{data.category}</span>
									<h1>{data.title}</h1>
									<div className="news-meta">
										<span>{data.author_name}</span>
										<time>{data.timestamp}</time>
									</div>
								</header>
								<div dangerouslySetInnerHTML={{ __html: data.description }} />
							</article>
						</section>
					</div>
				</div>
			</div>
		);
	};
}
