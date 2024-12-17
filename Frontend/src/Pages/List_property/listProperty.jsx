import { useState, useEffect } from 'react';
import {Link} from "react-router-dom";
import AppLayout from "../../Components/App_layout/appLayout.jsx";
import userRole from "../../userRole.jsx";

const ListProperty = () => {
    const [properties, setProperties] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);
    const [pageNo, setPageNo] = useState(1);
    const [sortField, setSortField] = useState("");
    const [sortDir, setSortDir] = useState("desc");
    const {role} = userRole()

    const handleFieldChange = (field) => {
        setSortField(field);
        if(sortDir === "desc") {
            setSortDir("asc");
        }else if(sortDir === "asc") {
            setSortDir("desc");
        }
    };

    const fetchProperties = async (page = 1) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/properties/get?pageNo=${page}&count=10&sortField=${sortField}&sortDir=${sortDir}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ` + localStorage.getItem("token"),
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setProperties(data.properties || []);
            setCurrentPage(data.currentPage || 1);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            setError("Error fetching properties: " + error.message);
        }
    };

    const deleteProperty = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/properties/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to delete property with ID: ${id}`);
            }
            fetchProperties(pageNo);
        } catch (error) {
            console.error('Error deleting property:', error);
        }
    };

    useEffect(() => {
        fetchProperties(pageNo);
    }, [pageNo, sortField, sortDir]);

    if (error) return <p>{error}</p>;

    return (
        <AppLayout>
            <div className="property-list-container">
                <h2 className="property-list-header">All your Property</h2>
                <table className="property-table">
                    <thead>
                    <tr>
                        <th><p onClick={() => handleFieldChange("inventoryNumber")}>Inventory Number</p></th>
                        <th><p onClick={() => handleFieldChange("name")}>name</p></th>
                        <th><p onClick={() => handleFieldChange("price")}>Price</p></th>
                        <th><p onClick={() => handleFieldChange("responsiblePeople")}>Responsible User</p></th>
                        <th><p onClick={() => handleFieldChange("category")}>Category</p></th>
                        <th><p onClick={() => handleFieldChange("location")}>Location</p></th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {properties.map((property) => (
                        <tr key={property.id}>
                            <td>{property.inventoryNumber}</td>
                            <td>{property.name}</td>
                            <td>{property.price}</td>
                            <td>{property.responsiblePeople}</td>
                            <td>{property.category}</td>
                            <td>{property.location}</td>
                            <td className="links-list-property">
                                <Link className="property-link" to={`/detail/${property.id}`} state={{ from: `/list` }}>Detail</Link>
                                <Link to={`/update/${property.id}`} className="property-link" state={{ from: `/list` }}>
                                    Update
                                </Link>
                                {role === "Admin" && (
                                    <>
                                        <Link className="property-link" to={"/list"}
                                              onClick={() => deleteProperty(property.id)}>Remove</Link>
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
                        onClick={() => setPageNo(pageNo - 1)}
                        disabled={pageNo <= 1}
                    >
                        Previous
                    </button>
                    <span className="pagination-text"> Page {currentPage} of {totalPages} </span>
                    <button
                        className="pagination-button"
                        onClick={() => setPageNo(pageNo + 1)}
                        disabled={pageNo >= totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </AppLayout>
    );
};

export default ListProperty;
