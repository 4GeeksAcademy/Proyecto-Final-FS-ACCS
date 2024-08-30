const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			babyData: {
                name: "",
                gender: "",
                age: "",
                height: "",
                weight: ""
            },
			blogs: [],
            userData: {
                username: "",
                email: "",
                password:"",
            },
            babies: [], // Agregado para almacenar la lista de bebés
            selectedBabyId: null, // Para seleccionar un bebé específico
            token:null,
            profilePicture:""
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},
            uploadProfilePicture: async(formData) =>{
                let {token}=getStore()
                let resp= await fetch(process.env.BACKEND_URL + "api/profilepic", {
                    method: "PUT",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }, 
                    body: formData
                })
                if (!resp.ok) return false
                let data= await resp.json()
                setStore ({profilePicture: data.profilePicture})

            },
            //Accion para obtener el perfil del usuario
			getUserInfo: async () => {
				try {
                    const store = getStore();
                    const token = store.token;
					const resp = await fetch(process.env.BACKEND_URL + "api/userinfo", {
                        headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}` // Enviar el token en la cabecera
						}
                    });
					if (resp.ok) {
						const data = await resp.json();
						if (data && data.user) {
                            setStore({ userData: data.user }); // Guardar los datos del usuario en userInfo
                        } else {
                            console.error("Failed to fetch user info: Data format is incorrect");
                        }
					} else {
						console.error("Failed to fetch user info");
					}
				} catch (error) {
					console.error("Error fetching user info:", error);
				}
			},
			//accion para reset password
			resetPassword: async (email, password) => {
				try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/reset_password", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    });
                    const data = await response.json();
                    return data;
                } catch (error) {
                    console.error("Error resetting password:", error);
                    return { success: false };
                }
            },
            // Accion para obtener la lista de bebés del usuario
            getBabiesByUser: async () => {
                try {
                    const store = getStore();
                    const token = store.token; // Obtener el token del store
                    //const userId = store.userData.id; // Suponiendo que userData contiene el id del usuario
                    const response = await fetch(process.env.BACKEND_URL + "api/babies", {
                        method: "GET",
                        headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${token}`
                         }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setStore({ babies: data }); // Actualizar el store con los datos de los bebés
                    } else {
                        console.error("Failed to fetch babies:", errorData.error);
                    }
                } catch (error) {
                    console.error("Error fetching babies", error);
                }
            },

            // Obtener datos de un bebé específico
			fetchBabyData: async (babyId) => {
                const store = getStore();
                const token = store.token;
				try {
                    const response = await fetch(process.env.BACKEND_URL + `/api/one_baby/${babyId}`,{
                        method: "GET",
                        headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${token}`
                         }
                    });
                    const data = await response.json();
            
                    if (response.ok && data && data.data) {
                        console.log("Fetched baby data:", data.data);
                        setStore({ babyData: data.data, selectedBabyId: babyId });
                    } else {
                        console.error("Failed to fetch baby data or data is missing:", data);
                    }
                } catch (error) {
                    console.error("Error fetching baby data:", error);
                }
			},

			// Actualizar los datos del bebé
            updateBabyData: async (updatedData) => {
                const store = getStore();
                const token = store.token;
                try {
                    const response = await fetch(process.env.BACKEND_URL + `/api/edit_baby/${updatedData.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(updatedData),
                    });
                    if (response.ok) {
                        const data = await response.json();
                        console.log("Baby data updated successfully:", data);
                        setStore({ babyData: data.data });
                    } else {
                        console.error("Failed to update baby data");
                    }
                } catch (error) {
                    console.error("Error updating baby data", error);
                }
            },

			// Crear Blog
			createBlog: async (blogData) => {
                const store = getStore();
                try {
                    const response = await fetch(process.env.BACKEND_URL + "api/new_blog", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(blogData)
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log("Blog created successfully:", data);

                        setStore({
                            blogs: [...store.blogs, data.blog]
                        });

                        return true;
                    } else {
                        const errorData = await response.json();
                        console.error("Failed to create blog:", errorData);
                        return false;
                    }
                } catch (error) {
                    console.error("Error:", error);
                    return false;
                }
            },

            // Crear medias
            fetchAverages: async (babyId, interval) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/report/averages/${babyId}?interval=${interval}`);
                    if (response.ok) {
                        const data = await response.json();
                        console.log("Averages fetched successfully:", data);
                        return data.averages;
                    } else {
                        console.error("Failed to fetch averages");
                        return null;
                    }
                } catch (error) {
                    console.error("Error fetching averages", error);
                    return null;
                }
            },

            // Crear maximos y minimos
            fetchExtremes: async (babyId, interval) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/report/extremes/${babyId}?interval=${interval}`);
                    if (response.ok) {
                        const data = await response.json();
                        console.log("Extremes fetched successfully:", data);
                        return data; // Retorna todo el objeto con "max" y "min"
                    } else {
                        console.error("Failed to fetch extremes");
                        return null;
                    }
                } catch (error) {
                    console.error("Error fetching extremes", error);
                    return null;
                }
            },

            // Login
            // Register
            register: async (formData) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "api/signup", {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        method: 'POST',
                        body: JSON.stringify(formData)
                    });

                    const data = await response.json();
                    if (data && data.token) {
                        setStore({ user: data.user, token: data.token });
                        localStorage.setItem('token', data.token);
                    } else {
                        throw new Error('Invalid response data');
                    }
                    return data;
                } catch (error) {
                    console.log("Error during registration:", error);
                    return { success: false, msg: error.message };
                }
            },

            // Login
            login: async (formData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}api/login`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'POST',
                        body: JSON.stringify(formData),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const data = await response.json();

                    if (data && data.token) {
                        setStore({ user: data.user, token: data.token });
                        localStorage.setItem('token', data.token);
                    } else {
                        throw new Error('Invalid response data');
                    }

                    return data;
                } catch (error) {
                    console.error("Error during login:", error);
                    return { success: false, msg: error.message };
                }
            },

            // Set token
            setToken: (token) => {
                setStore(prevStore => ({ ...prevStore, token }));
                localStorage.setItem('token', token);
            },

            // Set user
            setUser: (user) => {
                setStore(prevStore => ({ ...prevStore, user }));
            },
            //Accion para crear un nuevo bebe
            createBaby: async (babyData) => {
                try {
                    const store = getStore();
                    const userId = store.userData.id || 1; // Usa el userId del store, o 1 por defecto
                    const response = await fetch(process.env.BACKEND_URL + `/api/babies/user`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${store.token}`
                        },
                        body: JSON.stringify(babyData)
                    });

                    if (response.ok) {
                        const data = await response.json();
                        // Actualiza la lista de bebés en el store
                        setStore({ babies: [...store.babies, data] });
                        console.log("Baby created successfully:", data);
                        return true;
                    } else {
                        const errorData = await response.json();
                        console.error("Failed to create baby:", errorData);
                        return false;
                    }
                } catch (error) {
                    console.error("Error creating baby:", error);
                    return false;
                }
            },

            //Accion LOGOUT
            logout: () => {
				localStorage.removeItem('token')
				setStore({user:null, token:null})
				return true
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},


			Login: async (formData) => {
				try{
					// fetching data from the backend

					const resp = await fetch(process.env.BACKEND_URL + "/api/login", {
						headers: {
							'Content-type': 'application/ json'
						},
						method: 'POST',
						body: JSON.stringify(formData)

					})
					const data = await resp.json()
					setStore({ user: data.user,token: data.token })
					localStorage.setItem('token', data.token)
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},

			register: async (formData) => {
				try{
					// fetching data from the backend

					const resp = await fetch(process.env.BACKEND_URL + "/api/signup", {
						headers: {
							'Content-Type': 'application/json'
						},
						method: 'POST',
						body: JSON.stringify(formData)

					})
					const data = await resp.json()
					setStore({ user: data.user,token: data.token })
					localStorage.setItem('token', data.token)
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
            
            /// accion para cambiar la contraseña
            changePassword: async (currentPassword, newPassword) => {
                const store = getStore(); 
                const token = store.token;
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/changepassworduser", {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${token}` 
                        },
                        body: JSON.stringify({
                            current_password: currentPassword,
                            new_password: newPassword
                        })
                    });
            
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.msg || "Error updating password");
                    }
            
                    const data = await response.json();
                    console.log(data.msg);

                    // Si se cambia la contraseña, invalidar el token
                    // Limpiar el localStorage y el store
                    localStorage.removeItem('token');
                    setStore({ token: null, user: null });

                    return data;
                } catch (error) {
                    console.error("Error changing password:", error);
                    return null; 
                }
            },
      
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
