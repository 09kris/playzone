import React ,{useState} from "react";
import axios from "axios";
import { data } from "react-router-dom";
import { useUser } from "../../src/Context/UserContext";
const Login= ()=>{

    const [formData,setFormData]=useState({password:"",email:""})
      const [message, setMessage] = useState("");
    const {setUser}=useUser()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    const form=new FormData()
    form.append("email",formData.email)
    form.append("password",formData.password)
     try {
      const response = await axios.post(
        "http://localhost:8000/users/login",

        {username:"",
             email: formData.email,
          password: formData.password,},
        {
          withCredentials: true,
        }
      );

    //   console.log(" Registration response:", response.data);

    //   setIsError(false);
    
      const loggedInUser = response.data?.data?.user;
      setUser(loggedInUser);
      setMessage(response.data?.message || "User login successfully!");
      console.log(response.data)
    } catch (error) {
      console.error("❌ Registration error:", error);
    //   setIsError(true);
      setMessage(error.response?.data?.message || "Login failed");
    }
  };
    
    return(
        <>
          <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4"
    >
        <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

        <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Register
      </button>

{message}
    </form>
        </>
    )
}


export default Login