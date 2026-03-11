import { API_URL } from "../config";

const API_BASE_URL = API_URL;

export async function request(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return response.json();
}