'use client'

const API_URL = process.env.NEXT_PUBLIC_BACK_URL;

export default function DownloadButton({
    programId,
    materialId,
    name,
    title

}: {programId: string,
    materialId: string,
    name: string,
    title: string,
}) {

    const downloadMaterial = (programId: string, materialId: string) => {
        window.location.href = `${API_URL}/program/${programId}/materials/${materialId}/download`;
    };
  return (
      <div>
          <button
              className="text-xs font-extrabold text-gray-800 truncate max-w-[180px]"
              onClick={() => downloadMaterial(programId, materialId)}
          >
            <div className="flex flex-col items-start gap-1">
                <span className="text-base font-bold text-gray-900">
                    Pealkiri: {title}
                </span>

                <span className="text-sm font-medium text-gray-500">
                    Faili nimi: {name}
                </span>
            </div>
          </button>

      </div>
  )
}
