import React, { useContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Context } from "../store/appContext";

export const Reset_password = () => {
    const { store, actions } = useContext(Context);
	const [params, setParams]=useSearchParams()
	const navigate=useNavigate()

    async function submitForm(e){
		e.preventDefault()
		let formData= new FormData(e.target)
		let password=formData.get("password")
		let passwordConfirm=formData.get("passwordConfirm")
		
		if(password== passwordConfirm){
			let baseUrl=process.env.BACKEND_URL
			let resp= await fetch(baseUrl+"/api/changepassword", {
				method: "PATCH",
				headers: {"Content-Type":"application/json", "Authorization":"Bearer "+params.get("token")},
				body: JSON.stringify({password}) 
			})

			if(resp.ok){
				console.log("Clave cambiada")
				navigate("/")
			}
		}else{
			console.log("Claves invalidas")
		}
	}


    return (
        <div style={{ backgroundColor: '#B4E49D', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="container" style={{ width: '80vw', maxWidth: '500px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', marginTop: '55px' }}>
                <h2>Reset Password</h2>
                
                <form onSubmit={submitForm}>
                    <div className="mb-3">
                        <label>New Password</label>
                        <input name="password" type="password" style={{ width: '100%', borderRadius: '10px', border: '1px solid #B4E49D', padding: '10px' }}/>
                    </div>
                    <div className="mb-3">
                        <label>Confirm Password</label>
                        <input name="passwordConfirm" type="password" style={{ width: '100%', borderRadius: '10px', border: '1px solid #B4E49D', padding: '10px' }}/>
                        <div id="emailHelp" className="form-text">Confirme su clave.</div>
                    </div>
                    
                    <button type="submit" style={{ backgroundColor: '#B4E49D', border: 'none', borderRadius: '10px', padding: '10px', color: 'white' }}>Reset Password</button>
                </form>
            </div>
        </div>
    );
};
