import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../Components/App_layout/appLayout.jsx";
import PropertyForm from "../../Components/Form_add_update/formAddUpdate.jsx";

const AddProperty = () => {
    const [property, setProperty] = useState({
        inventoryNumber: "",
        name: "",
        responsiblePeople: "",
        price: "",
        category: "",
        location: "",
    });
    const [profileImage, setProfileImage] = useState(null);
    const [images, setImages] = useState([]);
    const [invoice, setInvoice] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("propertyDto", new Blob([JSON.stringify(property)], { type: "application/json" }));
        if (profileImage) {
            formData.append("profileImage", profileImage);
        }
        if (invoice) {
            formData.append("invoice", invoice);
        }
        images.forEach((image) => {
            formData.append("images", image);
        });

        try {
            const response = await fetch("http://localhost:8080/api/properties/add", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            });

            if (response.ok) {
                navigate("/dashboard");
            } else {
                const errorMessage = await response.text();
                setError(`Chyba serveru: ${errorMessage}`);
            }
        } catch (error) {
            setError(`Chyba při odesílání formuláře: ${error.message}`);
        }
    };

    return (
        <AppLayout>
            <PropertyForm
                headline={"Přidat nemovitost"}
                property={property}
                setProperty={setProperty}
                profileImage={profileImage}
                setProfileImage={setProfileImage}
                images={images}
                setImages={setImages}
                invoice={invoice}
                setInvoice={setInvoice}
                handleSubmit={handleSubmit}
                error={error}
            />
        </AppLayout>
    );
};

export default AddProperty;

