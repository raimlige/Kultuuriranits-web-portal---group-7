"use client";

import { useState } from "react";
import { Category } from "../models/Category";

import {
  ArrowRight,
  FileText,
  ChevronDown,
  ImageIcon,
  PlusCircle,
  Trash,
} from "lucide-react";

interface ProgramAddFormProps {
  categories: Category[];
  organizationId: number | undefined;
  onSuccess: (newProgram: any) => void;
}

const ESTONIAN_COUNTIES = [
  "Harjumaa",
  "Tartumaa",
  "Pärnumaa",
  "Viljandimaa",
  "Lääne-Virumaa",
  "Ida-Virumaa",
  "Saaremaa",
  "Hiiumaa",
  "Raplamaa",
  "Järvamaa",
  "Jõgevamaa",
  "Põlvamaa",
  "Valgamaa",
  "Võrumaa",
  "Läänemaa",
];

const CURRICULUM_PRESETS = [
  "Ajalugu",
  "Ühiskonnaõpetus",
  "Kultuuriteadlikkus",
  "Kunst",
  "Muusika",
  "Tehnoloogia",
  "Bioloogia",
  "Loodusõpetus",
  "Emakeel",
];

const API_URL = process.env.NEXT_PUBLIC_BACK_URL;

export function ProgramAddForm({
  categories,
  organizationId,
  onSuccess,
}: ProgramAddFormProps) {
  const [formimageFile, setFormImageFile] = useState<File | null>(null);
  const [formMaterialFile, setFormMaterialFile] = useState<File | null>(null);
  const [formMaterialName, setFormMaterialName] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formShortDesc, setFormShortDesc] = useState("");
  const [formConnectionDesc, setFormConnectionDesc] = useState("");
  const [formFullDesc, setFormFullDesc] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formDuration, setFormDuration] = useState(0);
  const [formPrice, setFormPrice] = useState(0);
  const [formMinGroupSize, setFormMinGroupSize] = useState(0);
  const [formMaxGroupSize, setFormMaxGroupSize] = useState(0);
  const [formCounty, setFormCounty] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formTargetGroups, setFormTargetGroups] = useState<string[]>([]);
  const [formCategories, setFormCategories] = useState("");
  const [formConnections, setFormConnections] = useState<string[]>([]);
  const [formLanguages, setFormLanguages] = useState<string[]>([]);
  const [materials, setMaterials] = useState<{ file: File; name: string }[]>(
    [],
  );
  const [wheelchair, setWheelchair] = useState(false);
  const [hev, setHev] = useState(false);
  const [lak, setLak] = useState(false);
  const [outdoor, setOutdoor] = useState(false);
  const [formAdditionalInfo, setFormAdditionalInfo] = useState("");
  const [formPublished, setFormPublished] = useState("Inactive");

  const handleMaterialFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const allowedExtensions =
        /(\.pdf|\.png|\.jpg|\.jpeg|\.doc|\.docx|\.xls|\.xlsx|\.ppt|\.pptx|\.txt)$/i;

      if (!allowedExtensions.exec(file.name)) {
        alert(
          "Lubatud on ainult järgmised failivormingud: PDF, pildid (PNG, JPG) ja Office dokumendid!",
        );
        e.target.value = "";
        setFormMaterialFile(null);
        return;
      }
      setFormMaterialFile(file);
    }
  };

  const handleAddMaterial = () => {
    if (!formMaterialFile) return;

    const allowedExtensions =
      /(\.pdf|\.png|\.jpg|\.jpeg|\.doc|\.docx|\.xls|\.xlsx|\.ppt|\.pptx|\.txt)$/i;
    if (!allowedExtensions.exec(formMaterialFile.name)) {
      alert(
        "Lubatud on ainult järgmised failivormingud: PDF, pildid (PNG, JPG) ja Office dokumendid!",
      );
      return;
    }

    setMaterials((prev) => [
      ...prev,
      {
        file: formMaterialFile,
        name: formMaterialName || formMaterialFile.name,
      },
    ]);

    setFormMaterialFile(null);
    setFormMaterialName("");
  };

  const handleCreateNewClick = () => {
    setFormTitle("");
    setFormShortDesc("");
    setFormFullDesc("");
    setFormLocation("");
    setFormDuration(0);
    setFormPrice(0);
    setFormMinGroupSize(0);
    setFormMaxGroupSize(0);
    setFormCounty("");
    setFormAddress("");
    setOutdoor(false);
    setWheelchair(false);
    setHev(false);
    setLak(false);
    setFormEmail("");
    setFormPhone("");
    setFormTargetGroups([]);
    setFormCategories("");
    setFormConnections([]);
    setFormLanguages([]);
    setFormAdditionalInfo("");
    setFormPublished("Inactive");
    setFormImageFile(null);
    setFormMaterialFile(null);
    setFormMaterialName("");
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (formLanguages.length === 0) {
      alert("Palun vali vähemalt üks keel!");
      return;
    }

    if (formTargetGroups.length === 0) {
      alert("Palun lisa vähemalt üks sihtgrupp!");
      return;
    }

    if (!formimageFile) {
      alert("Palun vali pilt");
      return;
    }

    const newProg = {
      title: formTitle,
      location: formLocation,
      shortDescription: formShortDesc,
      description: formFullDesc,
      pricePerStudent: formPrice,
      targetGroups: formTargetGroups,
      durationMinutes: formDuration,
      languages: formLanguages,
      connection: formConnectionDesc,
      outdoor: outdoor,
      hev: hev,
      lak: lak,
      wheelchair: wheelchair,
      contactEmail: formEmail,
      contactPhone: formPhone,
      status: formPublished,
      minGroupSize: formMinGroupSize,
      maxGroupSize: formMaxGroupSize,
      connectionKeys: formConnections,
      county: formCounty,
      address: formAddress,
      addInfo: formAdditionalInfo,
      category: {
        id: Number(formCategories),
      },
      organizationId: organizationId,
    };

    const multipartData = new FormData();
    multipartData.append(
      "program",
      new Blob([JSON.stringify(newProg)], {
        type: "application/json",
      }),
    );

    if (formimageFile) {
      multipartData.append("imageFile", formimageFile);
    }

    if (materials && materials.length > 0) {
      materials.forEach((m, i) => {
        if (!m?.file) return;
        console.log("Material sent:", i, m.file.name);
        multipartData.append("materialFiles", m.file);
      });
    }

    const response = await fetch(`${API_URL}/program`, {
      method: "POST",
      body: multipartData,
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(errorText);
      alert("Programmi lisamine ebaõnnestus");
      return;
    }

    alert("Programm lisatud");
    handleCreateNewClick();
    onSuccess(newProg);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-8 mt-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="space-y-6">
            <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              Programmi põhiinfo
            </h3>

            {/* Program Title */}
            <div className="space-y-2">
              <label className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">
                Kultuuriprogrammi nimetus *
              </label>
              <input
                type="text"
                required
                placeholder="nt. Ajarännak minevikku"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-855 shadow-xs"
              />
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <label className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">
                Kultuuriprogrammi lühikirjeldus (1-2 lauset) *
              </label>
              <input
                type="text"
                required
                placeholder="Maksimaalselt 150 tähemärki"
                value={formShortDesc}
                onChange={(e) => setFormShortDesc(e.target.value)}
                className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-855 shadow-xs"
              />
            </div>

            {/* Full Description */}
            <div className="space-y-2">
              <label className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">
                Kultuuriprogrammi kirjeldus *
              </label>
              <textarea
                required
                rows={6}
                placeholder="Kirjelda siin programmi sisu, tegevusi, tulemusi jne..."
                value={formFullDesc}
                onChange={(e) => setFormFullDesc(e.target.value)}
                className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-855 shadow-xs"
              ></textarea>
            </div>

            {/* Keeled */}
            <div className="space-y-2.5">
              <div className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">
                Keeled *
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-150">
                {["Eesti", "Inglise", "Vene", "Muu"].map((lang) => (
                  <div
                    key={lang}
                    className="flex items-center gap-3 text-base font-bold text-gray-700 select-none"
                  >
                    <input
                      type="checkbox"
                      checked={formLanguages.includes(lang)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormLanguages([...formLanguages, lang]);
                        } else {
                          setFormLanguages(
                            formLanguages.filter((l) => l !== lang),
                          );
                        }
                      }}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded accent-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    {lang}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 my-8 pt-8"></div>

          {/* Section 2: Teemad ja sihtgrupp */}
          <div className="space-y-6">
            <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              Teemad ja sihtgrupp
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Kategooriad */}
              <div className="space-y-2">
                <label className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">
                  Kategooriad *
                </label>
                <div className="relative">
                  <select
                    value={formCategories}
                    required
                    onChange={(e) => setFormCategories(e.target.value)}
                    className="block w-full pl-4 pr-10 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer h-[54px] appearance-none"
                  >
                    <option value="">Lisa teema / kategooria...</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Sihtgrupp */}
              <div className="space-y-2">
                <label className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">
                  Sihtgrupp *
                </label>
                <div className="relative">
                  <select
                    value=""
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val && !formTargetGroups.includes(val)) {
                        setFormTargetGroups([...formTargetGroups, val]);
                      }
                      e.target.value = "";
                    }}
                    className="block w-full pl-4 pr-10 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer h-[54px] appearance-none"
                  >
                    <option value="">Lisa sihtgrupp...</option>
                    {[
                      "Lasteaed",
                      "1. - 3. klass",
                      "4. - 6. klass",
                      "7. - 9. klass",
                      "Gümnaasium",
                    ].map((grp) => (
                      <option
                        key={grp}
                        value={grp}
                        disabled={formTargetGroups.includes(grp)}
                      >
                        {grp}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>

                <div className="flex flex-wrap gap-2 mt-3 bg-gray-50 p-3 rounded-xl border border-gray-150 min-h-[52px] items-center">
                  {formTargetGroups.map((grp) => (
                    <span
                      key={grp}
                      className="inline-flex items-center gap-2 bg-white border border-gray-200 text-blue-700 text-sm font-bold px-3 py-1 rounded-lg shadow-xs"
                    >
                      {grp}
                      <button
                        type="button"
                        onClick={() =>
                          setFormTargetGroups(
                            formTargetGroups.filter((g) => g !== grp),
                          )
                        }
                        className="text-blue-500 hover:text-blue-700 font-extrabold cursor-pointer text-sm ml-1"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  {formTargetGroups.length === 0 && (
                    <span className="text-sm text-gray-455 italic">
                      Ühtegi sihtgruppi pole valitud
                    </span>
                  )}
                </div>
              </div>

              {/* Õppekavaseosed */}
              <div className="space-y-2">
                <label className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">
                  Õppekavaseosed
                </label>
                <div className="relative">
                  <select
                    value={""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val && !formConnections.includes(val)) {
                        setFormConnections((prev) => [...prev, val]);
                      }
                      e.target.value = "";
                    }}
                    className="block w-full pl-4 pr-10 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer h-[54px] appearance-none"
                  >
                    <option value="">Lisa õppekavaseos...</option>
                    {CURRICULUM_PRESETS.map((conn) => (
                      <option
                        key={conn}
                        value={conn}
                        disabled={formConnections.includes(conn)}
                      >
                        {conn}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>

                <div className="flex flex-wrap gap-2 mt-3 bg-gray-50 p-3 rounded-xl border border-gray-150 min-h-[52px] items-center">
                  {formConnections.map((conn) => (
                    <span
                      key={conn}
                      className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold px-3 py-1 rounded-lg shadow-xs"
                    >
                      {conn}
                      <button
                        type="button"
                        onClick={() =>
                          setFormConnections(
                            formConnections.filter((c) => c !== conn),
                          )
                        }
                        className="text-gray-400 hover:text-gray-700 font-extrabold cursor-pointer text-sm ml-1"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  {formConnections.length === 0 && (
                    <span className="text-sm text-gray-455 italic">
                      Õppekavaseoseid pole lisatud
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">
                  Õppekavaseose kirjeldus
                </label>
                <input
                  type="text"
                  placeholder="Õppekavaseose kirjeldus.."
                  value={formConnectionDesc}
                  onChange={(e) => setFormConnectionDesc(e.target.value)}
                  className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-855 shadow-xs"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                Toimumise info
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1.5">
                  <label className="text-base font-extrabold text-gray-800 block">
                    Hind õpilase kohta *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="nt. 10€"
                    value={formPrice || ""}
                    onChange={(e) =>
                      setFormPrice(parseInt(e.target.value) || 0)
                    }
                    className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-base font-extrabold text-gray-800 block">
                    Kestus *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="nt. 90 min"
                    value={formDuration || ""}
                    onChange={(e) =>
                      setFormDuration(parseInt(e.target.value) || 0)
                    }
                    className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-base font-extrabold text-gray-800 block">
                    Minimaalne grupp *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="10"
                    value={formMinGroupSize || ""}
                    onChange={(e) =>
                      setFormMinGroupSize(parseInt(e.target.value) || 0)
                    }
                    className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-base font-extrabold text-gray-800 block">
                    Maksimaalne grupp *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="30"
                    value={formMaxGroupSize || ""}
                    onChange={(e) =>
                      setFormMaxGroupSize(parseInt(e.target.value) || 0)
                    }
                    className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-base font-extrabold text-gray-800 block">
                    Maakond *
                  </label>
                  <div className="relative">
                    <select
                      value={formCounty}
                      required
                      onChange={(e) => setFormCounty(e.target.value)}
                      className="block w-full pl-5 pr-10 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 cursor-pointer h-[54px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                    >
                      <option value="">Vali maakond...</option>
                      {ESTONIAN_COUNTIES.map((cnt) => (
                        <option key={cnt} value={cnt}>
                          {cnt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-base font-extrabold text-gray-800 block">
                    Toimumiskoht *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="nt. Eesti Rahva Muuseum"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-base font-extrabold text-gray-800 block">
                  Täpne aadress *
                </label>
                <input
                  type="text"
                  required
                  placeholder="nt. Muuseumi tee 2, 60532 Tartu"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                />
              </div>

              <div className="space-y-2">
                <div className="text-base font-extrabold text-gray-800 block uppercase tracking-wider">
                  Muu toimumisinfo
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 bg-gray-50 p-5 rounded-xl text-base font-bold text-gray-700 border border-gray-150">
                  {[
                    {
                      label: "Ligipääs ratastooliga",
                      checked: wheelchair,
                      setter: setWheelchair,
                    },
                    { label: "HEV", checked: hev, setter: setHev },
                    { label: "LAK", checked: lak, setter: setLak },
                    {
                      label: "Toimub välitingimustes",
                      checked: outdoor,
                      setter: setOutdoor,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 select-none"
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={(e) => item.setter(e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded accent-blue-600 cursor-pointer"
                      />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 my-8 pt-8"></div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            Meedia ja õppematerjalid
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Kaanefoto */}
            <div className="space-y-3">
              <label className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">
                Programmi kaanefoto *
              </label>
              <div className="border border-gray-200 bg-gray-50 rounded-2xl overflow-hidden h-48 flex flex-col items-center justify-center relative group shadow-xs">
                {formimageFile ? (
                  <>
                    <img
                      src={URL.createObjectURL(formimageFile)}
                      alt="Programmi kaanefoto eelvaade"
                      className="w-full h-full object-cover"
                    />
                    {/* HOVERIGA ILMUV KIHT */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      {/* Tekst jääb alati täpselt keskele */}
                      <span className="text-white text-xs font-bold bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/30 select-none">
                        Kaanefoto valitud
                      </span>

                      {/* Punane eemaldamise nupp */}
                      <button
                        type="button"
                        onClick={() => setFormImageFile(null)}
                        className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white py-2 px-3.5 rounded-xl cursor-pointer shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 font-bold text-xs"
                        title="Eemalda kaanefoto"
                      >
                        <Trash className="w-3.5 h-3.5" />
                        Eemalda
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <span className="text-base text-gray-450 font-semibold">
                      Pilti pole veel valitud
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="flex-1 bg-white border border-gray-300 rounded-xl px-5 py-3.5 text-base font-bold text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all cursor-pointer shadow-xs active:scale-98 border-dashed border-2 hover:border-blue-400">
                    <PlusCircle className="w-5 h-5 text-gray-400" />
                    {formimageFile ? "Vaheta kaanefoto" : "Vali fail arvutist"}
                    <input
                      // DÜNAAMILINE KEY lahendab probleemi: kui pilt eemaldatakse, alglaaditakse input täielikult
                      key={formimageFile ? formimageFile.name : "empty-image"}
                      type="file"
                      required={!formimageFile}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setFormImageFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Õppematerjalid */}
            <div className="space-y-3">
              <label className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">
                Õppematerjalid
              </label>

              <div className="space-y-3">
                <div className="border border-gray-200 bg-gray-50 rounded-2xl p-6 space-y-4 shadow-xs">
                  <input
                    type="text"
                    placeholder="Materjali nimetus (nt. Tööleht)"
                    value={formMaterialName}
                    onChange={(e) => setFormMaterialName(e.target.value)}
                    className="w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />

                  <label className="w-full bg-white border border-gray-300 rounded-xl px-5 py-3.5 text-base font-bold text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-100 hover:border-blue-400 transition-all cursor-pointer shadow-xs border-dashed border-2 text-center select-none active:scale-99">
                    <PlusCircle className="w-5 h-5 text-gray-400" />
                    {formMaterialFile ? (
                      <span className="text-blue-600 truncate max-w-xs">
                        Valitud: {formMaterialFile.name}
                      </span>
                    ) : (
                      "Vali fail (PDF, PNG, JPG, DOCX...)"
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf, .png, .jpg, .jpeg, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt"
                      onChange={handleMaterialFileChange}
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleAddMaterial}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-6 rounded-xl text-sm font-bold cursor-pointer transition-all shadow-xs active:scale-98 flex items-center justify-center gap-2 w-full"
                >
                  <PlusCircle className="w-5 h-5" />
                  Lisa õppematerjal nimekirja
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pt-1">
                {materials.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-gray-50 p-3 pl-4 rounded-xl border border-gray-150 shadow-xs"
                  >
                    <span className="flex items-center gap-2 font-bold text-gray-700 text-sm truncate max-w-[65%]">
                      <FileText className="w-5 h-5 text-gray-400 shrink-0" />
                      <span className="truncate">{m.name}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setMaterials(materials.filter((_, i) => i !== idx))
                      }
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-3.5 rounded-xl cursor-pointer shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 font-bold text-xs shrink-0"
                      title="Eemalda õppematerjal"
                    >
                      <Trash className="w-3.5 h-3.5" />
                      Eemalda
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-base font-extrabold text-gray-800 block">
                Lisainfo
              </label>
              <textarea
                rows={3}
                placeholder="Täiendav info programmi kohta..."
                value={formAdditionalInfo}
                onChange={(e) => setFormAdditionalInfo(e.target.value)}
                className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100 animate-fade-in">
          <p className="text-sm font-semibold text-gray-500 leading-relaxed">
            Täida allolevad kontaktandmed, mille kaudu õpetajad saavad Teiega
            ühendust võtta.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-base font-extrabold text-gray-800 block">
                Email *
              </label>
              <input
                type="email"
                required
                placeholder="kultuuri@asutus.ee"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-base font-extrabold text-gray-800 block">
                Telefon *
              </label>
              <input
                type="tel"
                required
                placeholder="+372 ..."
                value={formPhone}
                onChange={(e) => {
                  const sanitizedValue = e.target.value.replace(
                    /[^0-9+\s]/g,
                    "",
                  );
                  setFormPhone(sanitizedValue);
                }}
                className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Avalikustamise olek */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-150">
          <div>
            <span className="text-base font-extrabold text-gray-800 block uppercase tracking-wider">
              Avalikustamise olek
            </span>
            <span className="text-xs sm:text-sm text-gray-500 font-semibold block mt-0.5">
              Kas programm on salvestamise järel õpetajatele nähtav?
            </span>
          </div>
          <div className="relative">
            <select
              value={formPublished}
              onChange={(e) => setFormPublished(e.target.value)}
              className="bg-white border border-gray-300 rounded-xl pl-5 pr-10 py-3.5 text-base font-extrabold text-gray-800 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 h-[54px] appearance-none"
            >
              <option value="Active">Avalik (nähtav)</option>
              <option value="Inactive">Mitteavalik (draft)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Nupud */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={handleCreateNewClick}
            className="bg-white border border-gray-300 text-gray-700 px-8 py-3.5 rounded-xl text-base font-bold hover:bg-gray-50 transition-all cursor-pointer shadow-xs active:scale-98"
          >
            Tühjenda väljad
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white px-10 py-3.5 rounded-xl text-base font-bold hover:bg-blue-700 transition-all shadow-xs flex items-center gap-2 cursor-pointer transform active:scale-98"
          >
            Salvesta
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}