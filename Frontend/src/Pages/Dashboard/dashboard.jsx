import img1 from "../../Images/5442676.jpg";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import CardsProperty from "../../Components/Cards_property/cardsProperty.jsx";
import AppLayout from "../../Components/app_layout/appLayout.jsx";

import userRole from "../../userRole.jsx";

const Dashboard = () =>{
    const {role} = userRole();
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserRole, setNewUserRole] = useState("Správce majetku");
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(10);

    const fetchUsers = async (pageNo) => {
        try {
            const response = await fetch(`http://localhost:8080/api/users?pageNo=${pageNo}&size=${pageSize}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.content)
                setUsers(data.content); // Obsah s uživateli
                setTotalPages(data.totalPages); // Celkový počet stránek
            } else {
                console.error("Failed to fetch users");
            }
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();

        try {
            setNewUserEmail("")
            setNewUserRole("Správce majetku");
            const response = await fetch("http://localhost:8080/api/addUser", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: newUserEmail, role: newUserRole }),
            });

            if (response.ok) {
                alert("Uživatel byl úspěšně přidán:)");
                fetchUsers(currentPage);
            }
        } catch (err) {
            console.error("Register error:", err);
        }
    };

    const deleteUser = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/user/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to delete property with ID: ${id}`);
            }
            fetchUsers(currentPage);
        } catch (error) {
            console.error('Error deleting property:', error);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);





return (
    <AppLayout>
        <div className="app-welcome" style={{backgroundImage: `url(${img1})`, backgroundPosition: "end"}}>
            <h1>Welcome to MyProperty</h1>
            <p>We are here to help simplify the management of your wealth and allow you to focus on what
                is most important to you. Thank you for being with us.</p>
            <p>Your personal property management solution</p>
            <a href="">Commence</a>
        </div>
        <div className="container-properties">
            {(role === "Admin" || role === "Správce majetku") && (
                <>
                    <div className="properties-section">
                        <div className="title-properties-section">
                            <h3>Majetek</h3>
                            {(role === "Admin" || role === "Správce majetku") ? (
                                <Link to={"/add"}><i className="bi bi-file-earmark-plus-fill"></i>
                                    <span>ADD</span></Link>
                            ) : (<div></div>)}

                        </div>
                        <CardsProperty/>
                    </div>
                </>
            )}
            <div className="contacts-section">
                <h3>Uživatele</h3>
                {role === "Admin" && (
                    <>
                        <form className="add-user-dashboard" onSubmit={handleAddUser}>
                            <div>
                                <label htmlFor="email">Email nového uživatele</label>
                                <input type="email" value={newUserEmail}
                                       onChange={(e) => setNewUserEmail(e.target.value)} required/>
                            </div>
                            <label>
                                Role:
                                <select
                                    value={newUserRole}
                                    onChange={(e) => setNewUserRole(e.target.value)}
                                    required
                                >
                                    <option value="Správce majetku">Správce majetku</option>
                                    <option value="Zaměstnanec">Zaměstnanec</option>
                                </select>
                            </label>
                            <button type="submit">Přidat uživatele</button>
                        </form>
                    </>
                )}

                <div className="container-user-dashboard">
                    <table>
                        <thead>
                        <tr>
                            <th>Email</th>
                            <th>Name</th>
                            <th>Stav</th>
                            <th>Role</th>
                            <th>Akce</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td>{user.email}</td>
                                <td>{user.name}</td>
                                <td>
                                    {user.name.trim() === "" ? "probíhá" : "Přidán"}
                                </td>
                                <td>{user.role}</td>
                                <td>
                                    {user.role !== "Admin" && (
                                        <>
                                            <Link className="property-link" to={`/detail/${user.id}`}>Detail</Link>
                                            {role === "Admin" && (
                                                <>
                                                    <Link to={`/update/${user.id}`} className="property-link">Update</Link>
                                                    <Link className="property-link" to="/dashboard"
                                                        onClick={() => deleteUser(user.id)}>Remove</Link>
                                                </>
                                            )}
                                        </>
                                    )}
                                </td>

                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="pagination-container">
                        <button
                            className="pagination-button"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="pagination-text">
                    Page {currentPage} of {totalPages}
                </span>
                        <button
                            className="pagination-button"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
)
}

export default Dashboard;