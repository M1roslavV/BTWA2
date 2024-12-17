import { useEffect, useState } from "react";
import {Link} from "react-router-dom";

const CardsProperty = () => {
    const [properties, setProperties] = useState([]);
    const [images, setImages] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const token = localStorage.getItem("token");

    const BASE_URL = "http://localhost:8080/api/properties/view/";

    const fetchProperties = async (page = 1) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/properties/get?pageNo=${page}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setProperties(data.properties || []);
            setCurrentPage(data.currentPage || 1);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error("Error fetching properties:", error);
        }
    };

    const fetchImage = async (filename, id) => {
        try {
            const response = await fetch(`${BASE_URL}${filename}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error(`Failed to fetch image ${filename}`);
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setImages((prev) => ({ ...prev, [id]: imageUrl }));
        } catch (error) {
            console.error(`Error fetching image ${filename}:`, error);
        }
    };
    useEffect(() => {
        fetchProperties(currentPage);
    }, [currentPage]);

    useEffect(() => {
        properties.forEach((property) => {
            if (property.profileImageUrl && !images[property.id]) {
                fetchImage(property.profileImageUrl, property.id);
            }
        });
    }, [properties, images]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="container-cards-properties">
            {properties.map((property) => (
                <div key={property.id} className="property-card">
                    <div>
                        <img
                            src={images[property.id] || "/placeholder.png"} // Zobrazení obrázku nebo placeholderu
                            alt={property.name || "Default"}
                        />
                        <div className="property-card-text">
                            <h6>{property.inventoryNumber || "N/A"}</h6>
                            <p>{property.name || "No Name"}</p>
                            <p>{property.responsiblePeople || "No User"}</p>
                            <Link to={`/detail/${property.id}`} state={{from: `/dashboard`}}>Detail</Link>
                        </div>
                    </div>
                </div>
            ))}

            <div className="paging">
                <div className="pagination-container">
                    <button
                        className="pagination-button"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                    >
                        Previous
                    </button>
                    <span className="pagination-text"> Page {currentPage} of {totalPages} </span>
                    <button
                        className="pagination-button"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CardsProperty;
