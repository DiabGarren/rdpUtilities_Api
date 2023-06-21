import { getParam, getUserData } from './utils.mjs';

const id = getParam('id');
const userData = await getUserData(id);

document.title += ` ${userData.firstName} ${userData.lastName}`;
