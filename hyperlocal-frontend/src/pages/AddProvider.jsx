import { useState } from "react";
import api from "../services/api";

function AddProvider() {
  const [form, setForm] = useState({
    name: "",
    serviceType: "",
    area: "",
    phone: "",
    rating: 4
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post("/api/providers", form)
      .then(() => {
        alert("Provider added!");
        setForm({ name: "", serviceType: "", area: "", phone: "", rating: 4 });
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="container mt-4">
      <h2>Add Provider</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <input className="form-control mb-2" name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input className="form-control mb-2" name="serviceType" placeholder="Service Type" value={form.serviceType} onChange={handleChange} />
        <input className="form-control mb-2" name="area" placeholder="Area" value={form.area} onChange={handleChange} />
        <input className="form-control mb-2" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input className="form-control mb-2" name="rating" type="number" step="0.1" value={form.rating} onChange={handleChange} />
        <button className="btn btn-success">Add Provider</button>
      </form>
    </div>
  );
}

export default AddProvider;
