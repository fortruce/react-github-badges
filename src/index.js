import React, { Component } from "react";

const GITHUB = "https://github.com";
const GITHUB_API = "https://api.github.com";

const buttonStyle = {
	float: "left",
	outline: "none",
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

const GithubButton = ({ style, label, path, width, height }) => (
	<button style={ style }>
		<svg
			style={{ verticalAlign: "text-top" }}
			aria-hidden="true"
			height={ height }
			role="img"
			version="1.1"
			viewBox={ `0 0 ${width} ${height}` }
			width={ width }
		>
			<path d={ path }></path>
		</svg>
		&nbsp;{ label }
	</button>
);
GithubButton.defaultProps = {
	width: "14",
	height: "16"
};

const Star = onHover(
	buttonStyle,
	buttonHoverStyle,
	({ style }) => (
		<GithubButton
			style={ style }
			label="Star"
			path="M14 6l-4.9-0.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14l4.33-2.33 4.33 2.33L10.4 9.26 14 6z" />
	)
);

const Fork = onHover(
	buttonStyle,
	buttonHoverStyle,
	({ style }) => (
		<GithubButton
			style={ style }
			label="Fork"
			path="M8 1c-1.11 0-2 0.89-2 2 0 0.73 0.41 1.38 1 1.72v1.28L5 8 3 6v-1.28c0.59-0.34 1-0.98 1-1.72 0-1.11-0.89-2-2-2S0 1.89 0 3c0 0.73 0.41 1.38 1 1.72v1.78l3 3v1.78c-0.59 0.34-1 0.98-1 1.72 0 1.11 0.89 2 2 2s2-0.89 2-2c0-0.73-0.41-1.38-1-1.72V9.5l3-3V4.72c0.59-0.34 1-0.98 1-1.72 0-1.11-0.89-2-2-2zM2 4.2c-0.66 0-1.2-0.55-1.2-1.2s0.55-1.2 1.2-1.2 1.2 0.55 1.2 1.2-0.55 1.2-1.2 1.2z m3 10c-0.66 0-1.2-0.55-1.2-1.2s0.55-1.2 1.2-1.2 1.2 0.55 1.2 1.2-0.55 1.2-1.2 1.2z m3-10c-0.66 0-1.2-0.55-1.2-1.2s0.55-1.2 1.2-1.2 1.2 0.55 1.2 1.2-0.55 1.2-1.2 1.2z" />
	)
);

const Watch = onHover(
	buttonStyle,
	buttonHoverStyle,
	({ style }) => (
		<GithubButton
			style={ style }
			width="16"
			label="Watch"
			path="M8.06 2C3 2 0 8 0 8s3 6 8.06 6c4.94 0 7.94-6 7.94-6S13 2 8.06 2z m-0.06 10c-2.2 0-4-1.78-4-4 0-2.2 1.8-4 4-4 2.22 0 4 1.8 4 4 0 2.22-1.78 4-4 4z m2-4c0 1.11-0.89 2-2 2s-2-0.89-2-2 0.89-2 2-2 2 0.89 2 2z" />
	)
);

const CountSpan = onHover(numStyle, numHoverStyle, "span");

const ButtonCount = ({ count, repo, buttonLink, countLink, type }) => (
	<div style={{
		font: "13px / 1.4 Helvetica, Arial, sans-serif"
	}}>
		<a href={ buttonLink || `${GITHUB}/${repo}` }>
			{ React.createElement(type) }
		</a>
		<a href={ countLink || `${GITHUB}/${repo}/stargazers` }>
			<CountSpan>{ count }</CountSpan>
		</a>
	</div>
);

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

class GithubBadge extends Component {
	constructor(props) {
		super(props);
		this.state = {
			count: 0
		};
	}

	componentDidMount() {
		getRepoInfo(this.props.repo, (err, info) => err || this.setState({ count: this.props.countFn(info) }));
	}

	render() {
		return (
			<ButtonCount
				{ ...(this.props) }
				count={ this.state.count } />
		);
	}
}

export const GithubStar = props => (
	<GithubBadge
		buttonLink={ `${GITHUB}/${props.repo}` }
		countLink={ `${GITHUB}/${props.repo}/stargazers` }
		{ ...props }
		type={ Star }
		countFn={ info => info.stargazers_count } />
);

export const GithubFork = props => (
	<GithubBadge
		buttonLink={ `${GITHUB}/${props.repo}` }
		countLink={ `${GITHUB}/${props.repo}/network` }
		{ ...props }
		type={ Fork }
		countFn={ info => info.forks_count } />
);

export const GithubWatch = props => (
	<GithubBadge
		buttonLink={ `${GITHUB}/${props.repo}/subscription` }
		countLink={ `${GITHUB}/${props.repo}/watchers` }
		{ ...props }
		type={ Watch }
		countFn={ info => info.watchers_count } />
);
