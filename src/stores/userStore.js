import { writable } from 'svelte/store';

const initialUser = {
	id: '',
	firstname: '',
	lastname: '',
	avatar: ''
};

// Create a writable store with the initial user data
export const userStore = writable(initialUser);
