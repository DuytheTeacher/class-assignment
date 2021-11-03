import axios from 'axios';

const classesAPIUrl = 'https://evening-taiga-99781.herokuapp.com/api/user/classes';
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
            const response = await axios.get(classesAPIUrl);
            return response;
        } catch (error) {
            console.error(error);
        }
    },
    createClass: async (data) => {
        try {
            const randomImage = await images.getRandomImage();
            const response = await axios.post(classesAPIUrl, {...data, thumbnail: randomImage.request.responseURL});
            return response;
        } catch (error) {
            console.error(error);
        }
    }
}