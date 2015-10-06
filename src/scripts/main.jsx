;(()=> {

	// Load More Button component
	let LoadBtn = React.createClass({
		
		handleClick(e) {
			e.preventDefault();
			// Call parent component's handler
			this.props.onLoadMoreClick();
			return this;
		},

		render() {
			return(
				<a 
					onClick={this.handleClick} 
					className='load-more' 
					href="#">
					Load More Stories
				</a>
			);
		}
	
	});

	// News Item component
	let NewsItem = React.createClass({
		
		render() {
			return(
				<article 
					className='news-item'>
					{this.props.title}
				</article>
			);
		}

	});

	// New List component
	let NewsList = React.createClass({
		
		// Data endpoints
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

		// Payload at every `Load More` click. 
		// Change this to load less or more stories at every `Load More` click.
		bufferSize: 13,

		// Buffering News items
		buffer: [],
		
		// Grab data and hydrate buffer
		bufferData(url) {
			return fetch(url, {
				method: 'get'
			}).then((response) => {
				return response.json();
			}).then((responseJson) => {
				// Hydrate the buffer
				this.buffer = this.buffer.concat(responseJson);
				// Mark the endpoint as `used`
				_.findWhere(this.endPoints, {url: url}).used = true;
			}).catch((e) => {
				console.error(`bufferData failed: ${e}`);
			});
		},

		getInitialState() {
			return {
				// Starting with no data
				data: []
			};
		},

		// Append more stories. If buffer runs out, proxy to `bufferData` for more data.
		append() {
			// Find an unused endpoint, if any.
			let endPoint = _.findWhere(this.endPoints, {used: false}),
					updatedData;
			// Do we have enough data in buffer?
			if(this.buffer.length >= this.bufferSize) {
				// Add the buffered data to `state.data`
				updatedData = this.state.data.concat(this.buffer.splice(0, this.bufferSize));
				// Update state, UI updates reactively
				this.setState({
					data: updatedData
				});
			// Not enough in our buffer
			} else {
				// Any endpoins left unused?
				if(endPoint) {
					// Yes. Hit the endpoint and call this method immediately.
					this.bufferData(endPoint.url).then(this.append);
				} else {
					// No. Just use whatever's left in the buffer and update state.
					this.setState({
						data: this.state.data.concat(this.buffer.splice(0, this.buffer.length))
					});
				}
			}
			return this;
		},

		// Handle `Load More` clicks
		handleLoadMoreClick() {
			this.append();
			return this;
		},

		// First run of the app. This method is called once in the component lifecycle by React.
		componentDidMount() {
			this.append();
			return this;
		},

		render() {
			// Iteratively create child `NewsItem` components.
			let items = this.state.data.map((node)=> <NewsItem title = {node.title} content = {node.content} />);
			return(
				<div className='news-items'>
					{items}
					<LoadBtn onLoadMoreClick={this.handleLoadMoreClick} />
				</div>
			);
		}

	});
	
	// Render app in the container node.
	React.render(<NewsList />, document.getElementById('content'));

})();
