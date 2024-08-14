import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Home = () => {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState(false)

	const handleSubmit = (e) => {
		e.preventDefault()
		if (username === "" || password === "") {
			setError(true)
			return
		}
		setError(false)
	}
	return (
		<div className="container">
			<h1>WelcomeBack!</h1>
			<h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</h5>
			<form className="login">
				<form onSubmit={handleSubmit}>
					<div class="mb-3">
						<label for="exampleInputEmail1" class="form-label"></label>
						<input type="text" value={username} onChange={e => setUsername(e.target.value)} class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Username" />
						<div id="emailHelp" class="form-text"></div>
					</div>
					<div class="mb-3">
						<label for="exampleInputPassword1" class="form-label"></label>
						<input type="password" class="form-control" value={password} onChange={e => setPassword(e.target.value)} id="exampleInputPassword1" placeholder="Password" />
						<p>Forgot your password?</p>
					</div>
					<button type="submit" class="btn btn-primary">Login</button>
				</form>
				{error && <p className="text-danger">Todos los campos son obligatorios</p>}
			</form>
			<p><a class="link-opacity-50-hover" href="https://expert-guacamole-r475gg7979j9cg57-3000.app.github.dev/demo">Not a member? Sign up</a></p>
		</div>
	)
}	
