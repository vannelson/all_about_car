import { axiosInstance } from "./api";

function dataUrlToFile(dataUrl, filename) {
  try {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  } catch {
    return null;
  }
}

export async function createCarApi({
  fields,
  features = [],
  profileImage,
  displayImages = [],
  companyId,
}) {
  // Build multipart/form-data per CARAPI.png
  const form = new FormData();
  Object.entries(fields || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) form.append(key, String(value));
  });

  // Ensure company_id is present even if not in fields
  if (companyId !== undefined && companyId !== null) {
    form.set("company_id", String(companyId));
  }

  // features[]
  features.forEach((f) => form.append("features[]", f));

  // profileImageFile
  if (profileImage instanceof File || profileImage instanceof Blob) {
    form.append("profileImageFile", profileImage);
  } else if (typeof profileImage === "string" && profileImage.startsWith("data:")) {
    const f = dataUrlToFile(profileImage, "profile.png");
    if (f) form.append("profileImageFile", f);
  }

  // displayImagesFiles[]
  (displayImages || []).forEach((img, idx) => {
    if (img instanceof File || img instanceof Blob) {
      form.append("displayImagesFiles[]", img);
    } else if (typeof img === "string" && img.startsWith("data:")) {
      const f = dataUrlToFile(img, `display-${idx + 1}.png`);
      if (f) form.append("displayImagesFiles[]", f);
    }
  });

  // Let axios set the multipart boundary automatically
  if (import.meta?.env?.DEV) {
    try {
      // Log form keys in dev to verify payload shape
      // Note: DevTools already shows this, but this helps console tracing
      // Do not log file contents
      // eslint-disable-next-line no-console
      console.groupCollapsed("[cars] FormData payload");
      for (const [k, v] of form.entries()) {
        // eslint-disable-next-line no-console
        console.log(k, v instanceof File ? `File(${v.name}, ${v.size})` : v);
      }
      // eslint-disable-next-line no-console
      console.groupEnd();
    } catch {}
  }

  const res = await axiosInstance.post("/cars", form);
  return res.data;
}
