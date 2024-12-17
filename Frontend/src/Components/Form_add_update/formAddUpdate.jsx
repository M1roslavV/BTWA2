import PropTypes from "prop-types";

const PropertyForm = ({
                          headline,
                          property,
                          setProperty,
                          profileImage,
                          setProfileImage,
                          images,
                          setImages,
                          invoice,
                          setInvoice,
                          handleSubmit,
                          error,
                      }) => {

    PropertyForm.propTypes = {
        headline: PropTypes.string,
        property: PropTypes.object,
        setProperty: PropTypes.func,
        profileImage: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object,
        ]),
        setProfileImage: PropTypes.func,
        images: PropTypes.array,
        invoice: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object,
        ]),
        setImages: PropTypes.func,
        setInvoice: PropTypes.func,
        handleSubmit: PropTypes.func,
        error: PropTypes.string,
    }

    return (
        <div className="container-form">
            <h1>{headline}</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-add-update">
                    <div className="add-update-input">
                        <label htmlFor="inventoryNumber">Inventární číslo</label>
                        <input
                            type="text"
                            name="inventoryNumber"
                            value={property?.inventoryNumber || ""}
                            onChange={(e) =>
                                setProperty((prev) => ({...prev, inventoryNumber: e.target.value}))
                            }
                        />
                    </div>
                    <div className="add-update-input">
                        <label htmlFor="name">Název</label>
                        <input
                            type="text"
                            name="name"
                            value={property?.name || ""}
                            onChange={(e) =>
                                setProperty((prev) => ({...prev, name: e.target.value}))
                            }
                        />
                    </div>
                    <div className="add-update-input">
                        <label htmlFor="responsiblePeople">Zodpovědná osoba</label>
                        <input
                            type="text"
                            name="responsiblePeople"
                            value={property?.responsiblePeople || ""}
                            onChange={(e) =>
                                setProperty((prev) => ({...prev, responsiblePeople: e.target.value}))
                            }
                        />
                    </div>
                    <div className="add-update-input">
                        <label htmlFor="price">Cena</label>
                        <input
                            type="number"
                            name="price"
                            value={property?.price || ""}
                            onChange={(e) =>
                                setProperty((prev) => ({...prev, price: e.target.value}))
                            }
                        />
                    </div>
                    <div className="add-update-input">
                        <label htmlFor="category">Kategorie</label>
                        <input
                            type="text"
                            name="category"
                            value={property?.category || ""}
                            onChange={(e) =>
                                setProperty((prev) => ({...prev, category: e.target.value}))
                            }
                        />
                    </div>
                    <div className="add-update-input">
                        <label htmlFor="location">Umístění</label>
                        <input
                            type="text"
                            name="location"
                            value={property?.location || ""}
                            onChange={(e) =>
                                setProperty((prev) => ({...prev, location: e.target.value}))
                            }
                        />
                    </div>
                </div>

                <div className="other-parts-form">
                    <div className="other-part-form">
                        <label>Faktura: </label>
                        <input
                            type="file"
                            onChange={(e) => setInvoice(e.target.files[0])}
                            accept="application/pdf"
                        />
                        <div>
                            {invoice && (
                                <a
                                    href={URL.createObjectURL(invoice)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {invoice.name}
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="other-part-form">
                        <label>Profilový obrázek: </label>
                        <input
                            type="file"
                            onChange={(e) => setProfileImage(e.target.files[0])}
                            accept="image/jpeg, image/png"
                        />
                        <div>
                            {profileImage && (
                                <a href={URL.createObjectURL(profileImage)} target="_blank" rel="noopener noreferrer">{profileImage.name}</a>
                            )}
                        </div>
                    </div>

                    <div className="other-part-form">
                        <label>Další obrázky: </label>
                        <input
                            type="file"
                            multiple
                            onChange={(e) => setImages(Array.from(e.target.files))}
                            accept="image/jpeg, image/png"
                        />
                        <div>
                            {images?.length > 0 &&
                                images.map((file, index) => (
                                    <a key={index} href={URL.createObjectURL(file)} target="_blank"
                                       rel="noopener noreferrer">{file.name}</a>
                                ))}
                        </div>
                    </div>

                    <div className="button-send-form">
                        {error && <p style={{color: "red"}}>{error}</p>}
                        <button type="submit">{headline}</button>
                    </div>

                </div>

            </form>
        </div>
    );
};


export default PropertyForm;
