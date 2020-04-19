const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

const app = express();

const readJson = fs.readFileSync('./data/series.json');
let data = JSON.parse(readJson);

app.set('views', './views'); // specify the views directory
app.set('view engine', 'ejs'); // register the template engine

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/views'));

app.get('/', (req, res) => {
	const { filter } = req.query;  //you can take more const under curley bracket
	let filterData = [];

	if (filter) {
		for (let dt of data) {
			if (
				dt.Title.toLowerCase() === filter.toLowerCase() ||
				dt.Country.toLowerCase() === filter.toLowerCase() ||
				dt.ID === parseFloat(filter)
			) {
				filterData.push(dt);
			}
		}
	}
	if (!filter) {
		filterData = data;
	}
	res.render('index', { data: filterData, filter });
});

app.get('/add', (req, res) => {
	res.render('add');
});

app.post('/add', (req, res) => {
	const { title, country } = req.body;
	data.push({ ID: data.length + 1, Title: title, Country: country });
	fs.writeFileSync('./data/series.json', JSON.stringify(data, null, 4));
	res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
	const { id } = req.params;
	let dataId;

	for (let i = 0; i < data.length; i++) {
		if (Number(id) === data[i].ID) {
			dataId = i;
		}
	}
	res.render('edit', { data: data[dataId] });
});

app.post('/edit/:id', (req, res) => {
	const { id } = req.params;
	const { title, country } = req.body;

	let dataId;
	for (let i = 0; i < data.length; i++) {
		if (Number(id) === data[i].ID) {
			dataId = i;
		}
	}

	data[dataId].Title = title;
	data[dataId].Country = country;

	fs.writeFileSync('./data/series.json', JSON.stringify(data, null, 4));
	res.redirect('/');
});

app.get('/delete/:id', (req, res) => {
	const { id } = req.params;

	const newData = [];
	for (let i = 0; i < data.length; i++) {
		if (Number(id) !== data[i].ID) {
			newData.push(data[i]);
		}
	}
	data = newData;
	fs.writeFileSync('./data/series.json', JSON.stringify(data, null, 4));
	res.redirect('/');
});


const port = 3000;
app.listen(port, () => console.log(`json-bread listening on port ${port}!`));
