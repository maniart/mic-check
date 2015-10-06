;(()=> {

	let data = [
		{
			title: 'title one',
			content: 'content one'
		},
		{
			title: 'title two',
			content: 'content two'
		}
	];

	let LoadBtn = React.createClass({
		
		handleClick(e) {
			e.preventDefault();
			console.debug('LoadBtn click handler');
			this.props.onLoadMoreClick();
		},

		render() {
			return(
				<a onClick={this.handleClick} className='load-more' href="#">Load More</a>
			);
		}
	
	});

	let NewsItem = React.createClass({
		getInitialState() {
			return null;
		},
	
		render() {
			return(
				<article className='news-item'>
					{this.props.title}
				</article>
			);
		}

	});

	let NewsList = React.createClass({
		
		endPoints: [
			{ 
				url: '../data/articles1.json',
				used: false 
			},
			{ 
				url: '../data/articles2.json',
				used: false 
			}
		],

		bufferSize: 10,

		buffer: [],
		
		bufferData(endPoint) {
			return fetch(endPoint, {
				method: 'get'
			}).then((response) => {
				return response.json();
			}).then((responseJson) => {
				this.buffer = this.buffer.concat(responseJson);
			}).catch((e) => {
				console.error(`bufferData failed: ${e}`);
			});
		},

		getInitialState() {
			return {
				data: []
			};
		},

		append() {
			let endPoint = _.findWhere(this.endPoints, {used: false}),
					buf;
			if(this.buffer.length >= this.bufferSize) {
				buf = this.buffer.splice(0, this.bufferSize);
				this.setState({
					data: buf
				});
			} else {
				if(endPoint) {
					this.bufferData(endPoint.url).then(this.append);
				} else {
					this.setState({
						data: this.data.concat(this.buffer.splice(0, this.buffer.length - 1))
					});
				}
			}
			return this;
		},

		handleLoadMoreClick(e) {
			if(e) e.preventDefault();
			console.debug('NewsList click handler')
		},

		componentDidMount() {
			this.append();
			return this;
		},

		render() {
			let items = this.state.data.map((node)=> <NewsItem title = {node.title} content = {node.content} />);
			return(
				<div className='news-items'>
					{items}
					<LoadBtn onLoadMoreClick={this.handleLoadMoreClick} />
				</div>
			);
		}

	});
	
	React.render(<NewsList />, document.getElementById('content'));

})();
