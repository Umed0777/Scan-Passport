import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiUrl } from "@shared/lib/utils";
import axios from "axios";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

function parsePassportData(raw) {
  if (!raw || typeof raw !== "string") {
    return getDefaultData();
  }

  const result = getDefaultData();

  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const cyrillicCapsWords = [];
  for (const line of lines) {
    const capsWords = line.match(/[А-ЯЁ]{5,}/g);
    if (capsWords) {
      cyrillicCapsWords.push(...capsWords);
    }
  }

  if (cyrillicCapsWords.length >= 3) {
    result.surname = cyrillicCapsWords[0];
    result.name = cyrillicCapsWords[1];
    result.patronymic = cyrillicCapsWords[2];
  } else if (cyrillicCapsWords.length >= 2) {
    result.surname = cyrillicCapsWords[0];
    result.name = cyrillicCapsWords[1];
  } else if (cyrillicCapsWords.length >= 1) {
    result.surname = cyrillicCapsWords[0];
  }

  for (const line of lines) {
    const dateMatch = line.match(
      /(\d{1,2})\s*[\.\s]\s*(\d{1,2})\s*[\.\s]\s*(\d{4})/,
    );
    if (dateMatch) {
      const [_, day, month, year] = dateMatch;
      result.birthDate = `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year}`;
      break;
    }
  }
  const addressStart = lines.findIndex((line) =>
  /(ША[ХҲ]РИ|Ш\.?\s*ДУШАНБЕ|ДУШАНБЕ)/i.test(line)
);

if (addressStart !== -1) {
  let addressLines = lines.slice(addressStart, addressStart + 5);

  addressLines = addressLines.filter(
    (line) =>
      !/Вазъи|PMA|Marital|status|Blood|Tax|Гурӯҳи|резус/i.test(line)
  );

  let address = addressLines.join(" ");

  address = address.replace(/\b[A-Z]{1,2}\b/g, "");
  address = address.replace(/\s+/g, " ").trim();

  result.address = address;
}

  const innMatch = raw.match(/\b\d{9}\b/);

  if (innMatch) {
    result.inn = innMatch[0];
  }
const sexMatch = raw.match(/\b(M|F)\/?(M|F)?\b/);

if (sexMatch) {
  const sex = sexMatch[1];

  if (sex === 'M') {
    result.sex = 'Мужской';
  } else if (sex === 'F') {
    result.sex = 'Женский';
  }
}
if (/ТЧК|TJK|ТЈК|ТЧКІТЈК/i.test(raw)) result.nationality = "Таджик";

if (/TJK|ТЧК|ТЈК|ТЧКТЈК/i.test(raw)) {
  result.placeOfBirth = "Таджикистан";
}
for (let i = 0; i < lines.length; i++) {
  if (/Мақоми шиносномадиханда|Issuing Authority/i.test(lines[i])) {
    const issuingLine = lines[i + 1] || "";
    result.issuingAuthority = issuingLine.trim();
    break;
  }
}
for (let i = 0; i < lines.length; i++) {
  if (/Огози эътибор|Date of issue/i.test(lines[i])) {
    for (let j = i + 1; j < i + 5 && j < lines.length; j++) {
      const match = lines[j]?.match(/(\d{1,2})[.\s](\d{1,2})[.\s](\d{4})/);
      if (match) {
        const [_, day, month, year] = match;
        result.dateOfIssue = `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year}`;
        break;
      }
    }
  }

  if (/Анҷоми эътибор|Date of expiry/i.test(lines[i])) {
    for (let j = i + 1; j < i + 5 && j < lines.length; j++) {
      const match = lines[j]?.match(/(\d{1,2})[.\s](\d{1,2})[.\s](\d{4})/);
      if (match) {
        const [_, day, month, year] = match;
        result.dateOfExpiry = `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year}`;
        break;
      }
    }
  }
}
for (let i = 0; i < lines.length; i++) {
  if (/Рақами ягонаи миллӣ|National ID No/i.test(lines[i])) {
    for (let j = 0; j <= 3; j++) {
      const match = lines[i + j]?.match(/\d{10,}/);
      if (match) {
        result.nationalId = match[0];
        break;
      }
    }
  }
}
for (let i = 0; i < lines.length; i++) {
  if (/Раками шиноснома|Document No/i.test(lines[i])) {
    for (let j = 1; j <= 3; j++) {
      const line = lines[i + j] || "";
      const match = line.match(/[A-Z]{1,2}\d{6,9}/i);
      if (match) {
        result.documentNo = match[0];
        break;
      }
    }
    break;
  }
}
  const formatName = (name) => {
    if (!name || name === "Не указано") return name;
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  result.surname = formatName(result.surname);
  result.name = formatName(result.name);
  result.patronymic = formatName(result.patronymic);

  return result;
}

function getDefaultData() {
  return {
    surname: "Не указано",
    name: "Не указано",
    patronymic: "Не указано",
    birthDate: "Не указано",
    address: "Не указано",
    inn: "Не указано",
    sex: 'Не указано',
    dateOfIssue: "Не указано",
  dateOfExpiry: "Не указано",
    nationalId: "Не указано",
    nationality: 'Не указано',
    placeOfBirth: "Не указано", 
  issuingAuthority: "Не указано",
  documentNo: "Не указано",
  };
}

export const getPassports = createAsyncThunk(
  "passport/getPassports",
  async (filter = "") => {
    const url = filter
      ? `${apiUrl}/api/Passport?Data=${encodeURIComponent(filter)}`
      : `${apiUrl}/api/Passport`;
    const { data } = await axios.get(url, authHeader());
    return data.data.map((item) => ({
      id: item.id,
      filePath: item.filePath,
      departmentId: item.departmentId,
      createdAt: item.createdAt,
      data: parsePassportData(item.data),
    }));
  },
);

export const addPassport = createAsyncThunk(
  "passport/addPassport",
  async (newPassport) => {
    await axios.post(`${apiUrl}/api/Passport`, newPassport, authHeader());
  },
);

export const editPassport = createAsyncThunk(
  "passport/editPassport",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");

      const { data } = await axios.put(
        `${apiUrl}/api/Passport/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Ошибка при обновлении паспорта",
      );
    }
  },
);

export const deletePassport = createAsyncThunk(
  "passport/deletePassport",
  async (id) => {
    await axios.delete(`${apiUrl}/api/Passport/${id}`, authHeader());
    return id;
  },
);

export const viewPassport = createAsyncThunk(
  "passport/viewPassport",
  async (filePath, { rejectWithValue }) => {
    try {
      const url = filePath.startsWith("http")
        ? filePath
        : `${apiUrl}${filePath}`;
      const response = await axios.get(url, {
        ...authHeader(),
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);

      const newWindow = window.open(blobUrl, "_blank", "noopener,noreferrer");
      if (!newWindow) {
        throw new Error("Не удалось открыть новую вкладку. Блокировщик окон?");
      }
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

      return true;
    } catch (err) {
      console.error("Ошибка при загрузке PDF", err);
      return rejectWithValue("Не удалось открыть документ");
    }
  },
);

const passportSlice = createSlice({
  name: "passport",
  initialState: {
    passports: [],
    isLoading: false,
    error: null,
    isViewing: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPassports.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPassports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.passports = action.payload;
        state.error = null;
      })
      .addCase(getPassports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Ошибка запроса";
      })
      .addCase(deletePassport.fulfilled, (state, action) => {
        state.passports = state.passports.filter(
          (e) => e.id !== action.payload,
        );
      })
      .addCase(viewPassport.pending, (state) => {
        state.isViewing = true;
        state.error = null;
      })
      .addCase(viewPassport.fulfilled, (state) => {
        state.isViewing = false;
        state.error = null;
      })
      .addCase(viewPassport.rejected, (state, action) => {
        state.isViewing = false;
        state.error = action.payload || "Ошибка открытия документа";
      });
  },
});

export default passportSlice.reducer;
