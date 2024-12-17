import { useState, useEffect } from "react";
import {Link, useLocation, useParams} from "react-router-dom";
import AppLayout from "../../Components/App_layout/appLayout.jsx";

const DetailProperty = () => {
    const location = useLocation();
    const [property, setProperty] = useState(null);
    const [history, setHistory] = useState([]);
    const [historyPagination, setHistoryPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        startPage: 0,
        endPage: 0,
    });
    const [error, setError] = useState("");
    const [images, setImages] = useState({
        profile: null,
        invoice: null,
        imageUrls: [],
    });

    const { id } = useParams();

    const BASE_URL = "http://localhost:8080/api/properties/view/";

    const fetchPropertyDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/properties/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setProperty(data);

                if (data.profileImageUrl) {
                    fetchImage(data.profileImageUrl, "profile");
                }
                if (data.invoices) {
                    fetchImage(data.invoices, "invoice");
                }
                if (data.imageUrls && Array.isArray(data.imageUrls)) {
                    const imageUrls = [];
                    for (let i = 0; i < data.imageUrls.length; i++) {
                        const filename = data.imageUrls[i];
                        const imageUrl = await fetchImage(filename, "images");
                        imageUrls.push({ filename, url: imageUrl });
                    }

                    setImages((prevImages) => ({
                        ...prevImages,
                        imageUrls,
                    }));
                }

            } else {
                setError("Failed to fetch property details.");
            }
        } catch (error) {
            setError(`Error fetching property details: ${error.message}`);
        }
    };

    // Fetch image
    const fetchImage = async (filename, type) => {
        try {
            const response = await fetch(`${BASE_URL}${filename}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) throw new Error(`Failed to fetch image ${filename}`);
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);

            if (type === "images") {
                setImages((prevImages) => ({
                    ...prevImages,
                    imageUrls: [
                        ...(prevImages.imageUrls || []),
                        { filename, url: imageUrl },
                    ],
                }));
                return imageUrl;
            }

            setImages((prevImages) => ({
                ...prevImages,
                [type]: imageUrl,
            }));
        } catch (error) {
            console.error(`Error fetching image ${filename}:`, error);
        }
    };

    const fetchPropertyHistory = async (page = 1) => {
        try {
            const response = await fetch(`http://localhost:8080/api/properties/${id}/history?pageNo=${page}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                const { filteredHistories, startPage, endPage, totalPages, currentPage } = data;
                setHistory(filteredHistories);
                setHistoryPagination({ startPage, endPage, totalPages, currentPage });
            } else {
                setError("Failed to fetch property history.");
            }
        } catch (error) {
            setError(`Error fetching property history: ${error.message}`);
        }
    };
    const deleteImage = async (filename) => {
        try {
            setImages((prevImages) => ({
                ...prevImages,
                imageUrls: prevImages.imageUrls.filter((image) => image.filename !== filename),
            }));

            const response = await fetch(`http://localhost:8080/api/properties/delete-image/${encodeURIComponent(filename)}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to delete image from the database');
            }
        } catch (error) {
            console.error(`Error deleting image ${filename}:`, error);
        }
    };


    // Fetch data on component mount
    useEffect(() => {
        fetchPropertyDetails();
        fetchPropertyHistory();
    }, [id]);

    return (
        <AppLayout>
            <div className="container-detail-property">
                {property && (
                    <div>
                        <div className="headline-detail-property">
                            {error && <p style={{color: "red"}}>{error}</p>}
                            <h3>Tvůj majetek: {property.inventoryNumber} {property.name}</h3>
                            <Link to={`/update/${property.id}`} className="detail-property-btn-update"
                                  state={{from: `/detail/${property.id}`}}>
                                <i className="bi bi-house-gear-fill"></i>
                                <p>UPDATE</p>
                            </Link>
                            <Link to={location.state?.from} className="back-detail-property">Back</Link>
                        </div>

                        <div className="detail-info-property">
                            <h3>Detailní informace o vaší položce majetku</h3>
                            {images.profile && (
                                <img src={images.profile} alt="Profile"/>
                            )}
                            <div className="info-property">
                                <ul>
                                    <li><strong>Inventární číslo:</strong> {property.inventoryNumber}</li>
                                    <li><strong>Název:</strong> {property.name}</li>
                                    <li><strong>Zodpovědná osoba:</strong> {property.responsiblePeople}</li>
                                    <li><strong>Hodnota:</strong> {property.price}</li>
                                    <li><strong>Kategorie:</strong> {property.category}</li>
                                    <li><strong>Umístění:</strong> {property.location}</li>
                                    {images.invoice && (
                                        <li><strong>Faktura: </strong> <a href={images.invoice} target="_blank"
                                                                          rel="noopener noreferrer">Zobrazit</a>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div className="history-property">
                            <h3>Pohyby s položkou majetku</h3>
                            {history.length > 0 ? (
                                <div className="property-history-container">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th width="280px">Date</th>
                                            <th width="280px">Changer</th>
                                            <th width="340px">Change from</th>
                                            <th width="340px">Change to</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {history.map((entry, index) => (
                                            <tr key={index}>
                                                <td>{entry.dateTime}</td>
                                                <td>{entry.changer}</td>
                                                <td>{entry.changedFrom}</td>
                                                <td>{entry.changedTo}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                    <div className="pagination-container">
                                        <button
                                            className="pagination-button"
                                            onClick={() => fetchPropertyHistory(historyPagination.currentPage - 1)}
                                            disabled={historyPagination.currentPage === historyPagination.startPage}
                                        >
                                            Previous
                                        </button>
                                        <span className="pagination-text">
                                        Page {historyPagination.currentPage} of {historyPagination.totalPages}
                                        </span>
                                        <button
                                            className="pagination-button"
                                            onClick={() => fetchPropertyHistory(historyPagination.currentPage + 1)}
                                            disabled={historyPagination.currentPage === historyPagination.endPage}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            ) : (<p style={{paddingLeft:"60px"}}>U dané položky majetku zatím nejsou žádné pohyby!!</p>)}
                        </div>


                        <div className="images-detail-property">
                            <h3>Obrázky vaší položky majetku</h3>
                            {images.imageUrls.length > 0 ? (
                                <div>
                                    {images.imageUrls.map((image, index) => (
                                        <div key={index} style={{position: 'relative'}} className="images-property">
                                            <img
                                                src={image.url}
                                                alt={`Image ${index}`}
                                            />
                                            <button
                                                onClick={() => deleteImage(image.filename)}>
                                                X
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (<p style={{paddingLeft:"20px"}}>U dané položky majetku zatím nejsou žádné další obrázky!!</p>)}
                        </div>
                    </div>
                )}


            </div>
        </AppLayout>
    );
};

export default DetailProperty;
