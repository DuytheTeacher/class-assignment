import axios from 'axios';

const classAPIPrefix = 'http://localhost:5000/api/classrooms';
const randomImageUrl = 'https://source.unsplash.com/345x140/?learn,education';

export const images = {
    getRandomImage: async () => {
        try {
            const response = await axios.get(randomImageUrl);
            return response;
        } catch (error) {
            console.error(error);
        }
    }
}

export const classes = {
    getClasses: async () => {
        try {
            const response = await axios.get(`${classAPIPrefix}/list_classroom`);
            return response.data.payload;
        } catch (error) {
            console.error(error);
        }
    },
    createClass: async (data) => {
        try {
            const randomImage = await images.getRandomImage();
            const response = await axios.post(`${classAPIPrefix}/create`, {...data, thumbnail: randomImage.request.responseURL});
            return response;
        } catch (error) {
            console.error(error);
        }
    }
}