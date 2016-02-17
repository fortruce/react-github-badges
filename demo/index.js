import { GithubStar, GithubFork, GithubWatch } from "../dist";
import React from "react";
import { render } from "react-dom";

render(
	<div style={{
		display: "flex",
		justifyContent: "space-between",
		width: 340
	}}>
		<GithubStar repo="fortruce/react-fullstack-skeleton" />
		<GithubFork repo="fortruce/react-fullstack-skeleton" />
		<GithubWatch repo="fortruce/react-fullstack-skeleton" />
	</div>,
	document.getElementById("app")
);
