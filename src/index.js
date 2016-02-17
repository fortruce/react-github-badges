import React, { Component } from "react";

const GITHUB = "https://github.com";
const GITHUB_API = "https://api.github.com";

const buttonStyle = {
	float: "left",
	padding: "2px 10px",
	fontWeight: "bold",
	lineHeight: "20px",
	fontSize: "13px",
	color: "#333",
	verticalAlign: "middle",
	cursor: "pointer",
	border: "1px solid #d5d5d5",
	borderRadius: "3px",
	borderTopRightRadius: "0",
	borderBottomRightRadius: "0",
	backgroundImage: "linear-gradient(#fcfcfc, #eee)"
};

const buttonHoverStyle = {
	textDecoration: "none",
	backgroundColor: "#ddd",
	backgroundImage: "linear-gradient(#eee, #ddd)",
	borderColor: "#ccc"
};

const onHover = (baseStyle, hoverStyle, BaseComponent) => class extends Component {
	constructor(props) {
		super(props);
		this.state = { hover: false };
	}
	render() {
		return (
			<span
				onMouseEnter={ () => this.setState({ hover: true }) }
				onMouseLeave={ () => this.setState({ hover: false }) }
			>
				<BaseComponent
					{ ...(this.props) }
					style={ Object.assign({}, baseStyle, this.state.hover ? hoverStyle : {}) }
				/>
			</span>
		);
	}
};

let Star = ({ style }) => {
	return (
		<button style={ style }>
			<svg
				style={{
					verticalAlign: "text-top"
				}}
				aria-hidden="true"
				height="16"
				role="img"
				version="1.1"
				viewBox="0 0 14 16"
				width="14">
				<path d="M14 6l-4.9-0.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14l4.33-2.33 4.33 2.33L10.4 9.26 14 6z"></path>
			</svg>
			&nbsp;Star
		</button>
	);
};
Star = onHover(buttonStyle, buttonHoverStyle, Star);

const numStyle = {
	textDecoration: "none",
	padding: "2px 7px",
	fontSize: "11px",
	fontWeight: "bold",
	lineHeight: "20px",
	color: "#333",
	verticalAlign: "middle",
	backgroundColor: "#fff",
	border: "1px solid #ddd",
	borderLeft: "0",
	borderTopRightRadius: "3px",
	borderBottomRightRadius: "3px",
	float: "left"
};
const numHoverStyle = {
	cursor: "pointer",
	color: "#4078c0"
};
const CountSpan = onHover(numStyle, numHoverStyle, "span");

const StarCount = ({ count, repo }) => {
	return (
		<div style={{
			font: "13px / 1.4 Helvetica, Arial, sans-serif"
		}}>
			<a href={ `${GITHUB}/${repo}` }>
				<Star />
			</a>
			<a href={ `${GITHUB}/${repo}/stargazers` }>
				<CountSpan>{ count }</CountSpan>
			</a>
		</div>
	);
};

function getRepoInfo(repo, cb) {
	const request = new XMLHttpRequest();
	request.onreadystatechange = () => {
		if (request.readyState !== XMLHttpRequest.DONE
		   || request.status !== 200) {
			return cb(new Error("Failed to load stars"));
		}

		try {
			const resp = JSON.parse(request.responseText);
			return cb(null, resp);
		} catch (err) {
			return cb(err);
		}
	};
	request.open("GET", `${GITHUB_API}/repos/${repo}`);
	request.send();
}

export default class GithubStar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			count: 0
		};
	}

	componentDidMount() {
		getRepoInfo(this.props.repo, (err, info) => err || this.setState({ count: info.stargazers_count }));
	}

	render() {
		return (
			<StarCount
				repo={ this.props.repo }
				count={ this.state.count } />
		);
	}
}
