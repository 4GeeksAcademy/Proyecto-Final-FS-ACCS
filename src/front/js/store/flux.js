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
            }
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			//Nueva accion para obtener datos del bebe
			fetchBabyData: async () => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/one_baby/1"); // Ejemplo: obtener datos del bebé con id=1
                    const data = await resp.json();
                    if (data && data.bebe) {
                        setStore({ babyData: data.bebe });
                    }
                } catch (error) {
                    console.log("Error fetching baby data", error);
                }
            },

            // Acción para actualizar los datos del bebé
            //updateBabyData: (newData) => {
            //    const store = getStore();
            //    setStore({ babyData: { ...store.babyData, ...newData } });
            //},

			// Actualizar los datos del bebé
            updateBabyData: async (updatedData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/edit_baby/1`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedData),
                    });
                    if (response.ok) {
                        setStore({ babyData: updatedData });
                    } else {
                        console.error("Failed to update baby data");
                    }
                } catch (error) {
                    console.error("Error updating baby data", error);
                }
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
