import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
        setInput({ username: "", email: "", password: "" });
      }
    } catch (error) {
      console.log(error);
      toast.success(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        className="shadow-lg flex flex-col gap-5 p-8"
        onSubmit={handleSubmit}
      >
        <div className="my-2">
          <h1 className="text-center font-bold text-xl">INSTA</h1>
          <p className="text-center text-sm">
            Signup to see photo & videos from your friends
          </p>
        </div>

        <div>
          <Label className=" font-medium ">Username</Label>
          <Input
            type="text"
            className="focus-visible:ring-transparent my-1"
            onChange={handleChange}
            name="username"
            value={input.username}
          />
        </div>
        <div>
          <Label className=" font-medium">Email</Label>
          <Input
            type="email"
            className="focus-visible:ring-transparent my-1"
            onChange={handleChange}
            name="email"
            value={input.email}
          />
        </div>
        <div>
          <Label className=" font-medium">Password</Label>
          <Input
            type="password"
            className="focus-visible:ring-transparent my-1"
            onChange={handleChange}
            name="password"
            value={input.password}
          />
        </div>
        {loading ? (
          <Button>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait..
          </Button>
        ) : (
          <Button type="submit">Signup</Button>
        )}
        <span className="text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;
