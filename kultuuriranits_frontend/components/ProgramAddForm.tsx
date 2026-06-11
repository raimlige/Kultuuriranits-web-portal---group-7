"use client";

import { useState } from "react";
import { Category } from "../models/Category";
import { Organization } from "../models/Organization";

interface ProgramAddFormProps {
    categories: Category[];
    organizations?: Organization[];
}

const API_URL = process.env.NEXT_PUBLIC_BACK_URL;

export function ProgramAddForm({
    categories
}: ProgramAddFormProps) {

    const [imageFile, setImageFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        pricePerStudent: "",
        durationMinutes: "",
        targetGroup: "",
        minGroupSize: "",
        maxGroupSize: "",
        location: "",
        language: "Eesti",
        status: "Active",
        categoryId: ""
    });

    function handleChange(
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        if (!imageFile) {
            alert("Palun vali pilt");
            return;
        }

        const program = {
            title: formData.title,
            description: formData.description,
            pricePerStudent: Number(formData.pricePerStudent),
            durationMinutes: Number(formData.durationMinutes),
            targetGroup: formData.targetGroup,
            minGroupSize: Number(formData.minGroupSize),
            maxGroupSize: Number(formData.maxGroupSize),
            location: formData.location,
            language: formData.language,
            status: formData.status,
            category: {
                id: Number(formData.categoryId)
            }
        };

        const multipartData = new FormData();
        multipartData.append(
            "program",
            new Blob(
                [JSON.stringify(program)],
                {
                    type: "application/json"
                }
            )
        );

        multipartData.append(
            "imageFile",
            imageFile
        );

        const response = await fetch(
            `${API_URL}/program`,
            {
                method: "POST",
                body: multipartData,
                credentials: "include"
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error(errorText);

            alert("Programmi lisamine ebaõnnestus");
            return;
        }

        alert("Programm lisatud");

        setFormData({
            title: "",
            description: "",
            pricePerStudent: "",
            durationMinutes: "",
            targetGroup: "",
            minGroupSize: "",
            maxGroupSize: "",
            location: "",
            language: "Eesti",
            status: "Active",
            categoryId: ""
        });

        setImageFile(null);
    }

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                maxWidth: "600px"
            }}
        >
            <input
                name="title"
                placeholder="Pealkiri"
                value={formData.title}
                onChange={handleChange}
                required
            />

            <textarea
                name="description"
                placeholder="Kirjeldus"
                value={formData.description}
                onChange={handleChange}
                required
            />

            <input
                name="pricePerStudent"
                type="number"
                step="0.01"
                placeholder="Hind õpilase kohta"
                value={formData.pricePerStudent}
                onChange={handleChange}
            />

            <input
                name="durationMinutes"
                type="number"
                placeholder="Kestus minutites"
                value={formData.durationMinutes}
                onChange={handleChange}
            />

            <select
                name="targetGroup"
                value={formData.targetGroup}
                onChange={handleChange}
                required
            >
                <option value="">
                    Vali sihtgrupp
                </option>

                <option value="Algklassid (1.-4. klass)">
                    Algklassid (1.-4. klass)
                </option>

                <option value="Põhikool (5.-9. klass)">
                    Põhikool (5.-9. klass)
                </option>
            </select>

            <input
                name="minGroupSize"
                type="number"
                placeholder="Min grupi suurus"
                value={formData.minGroupSize}
                onChange={handleChange}
            />

            <input
                name="maxGroupSize"
                type="number"
                placeholder="Max grupi suurus"
                value={formData.maxGroupSize}
                onChange={handleChange}
            />

            <input
                name="location"
                placeholder="Asukoht"
                value={formData.location}
                onChange={handleChange}
            />

            <select
                name="language"
                value={formData.language}
                onChange={handleChange}
            >
                <option value="Eesti">
                    Eesti
                </option>

                <option value="Inglise">
                    Inglise
                </option>

                <option value="Vene">
                    Vene
                </option>
            </select>

            <select
                name="status"
                value={formData.status}
                onChange={handleChange}
            >
                <option value="Active">
                    Aktiivne
                </option>

                <option value="Inactive">
                    Mitteaktiivne
                </option>
            </select>

            <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
            >
                <option value="">
                    Vali kategooria
                </option>

                {categories.map((category) => (
                    <option
                        key={category.id}
                        value={category.id}
                    >
                        {category.name}
                    </option>
                ))}
            </select>

            <div>
                <label>
                    Programmi pilt
                </label>

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files?.[0]) {
                            setImageFile(
                                e.target.files[0]
                            );
                        }
                    }}
                    required
                />
            </div>

            {imageFile && (
                <div>
                    <p>Pildi eelvaade:</p>

                    <img
                        src={URL.createObjectURL(imageFile)}
                        alt="Preview"
                        style={{
                            maxWidth: "300px",
                            maxHeight: "300px",
                            objectFit: "cover",
                            border: "1px solid #ccc",
                            borderRadius: "8px"
                        }}
                    />
                </div>
            )}

            <button type="submit">
                Salvesta programm
            </button>
        </form>
    );
}