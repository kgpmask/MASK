const axios = require('axios');

const sampleData = [['H', 'I'], ['N', 'A']];

// axios.post('http://localhost:6969/checker/2021-08-1/crossword', JSON.stringify(sampleData)).then(res => console.log(res)).catch(res => console.log(res));
axios({
    method:"post",
    url:"http://localhost:6969/checker/2021-08-1/crossword",
    data: JSON.stringify(sampleData),
    headers: {
        'Content-Type': 'application/json',
    }
}).then(res => console.log(res)).catch(res => console.log(res));