//markerClicked is the start
//markers is the array

function doPrims(id){
	var pq = new pQueue();
	var results = [];
	var visitedFlags = [];

	var current;
	var currPos;
	for(var i = 0; i < markers.length; i++){
		if(markers[i]._id == id){
			currPos = i;
			break;
		}
	}

	for(var i = 0; i < markers.length; i++){
		visitedFlags[i] = false;
	}

	while(results.length < markers.length-1){
		if(!visitedFlags[currPos]){
			for(var i = markers.length - 1; i >= 0; i--){
				if(i != currPos){
					var distance = Math.pow(markers[currPos].position.lat-markers[i].position.lat, 2) + Math.pow(markers[currPos].position.lng-markers[i].position.lng, 2);
					pq.add({key: distance, value:[currPos, i]});
				}
			};
		}

		visitedFlags[currPos] = true;
		current = pq.remove();
		var index1 = current.value[0];
		var index2 = current.value[1];

		if (!visitedFlags[index2]){
			currPos = index2;
			results.push([index1, index2]);
		}
	}

	for(var i = 0; i < results.length; i++){
		var link1 = results[i][0];
		var link2 = results[i][1];

		markers[link2].link = markers[link1]._id;
		console.log(i)
	}
}

function pQueue(){
	var queue = [];

	this.size = function(){
		return queue.length;
	}

	this.add = function(newNode){
		queue.push(newNode);
		var pos = queue.length-1;

		while(pos > 0){
			var parent = Math.floor((pos-1)/2);

			if(queue[pos].key < queue[parent].key){
				var temp = queue[pos];
				queue[pos] = queue[parent];
				queue[parent] = temp;
			}
			else{
				break;
			}

			pos = parent;
		}
	}

	this.remove = function(newNode){
		var smallest = queue[0];

		queue[0] = queue[queue.length-1];
		queue.pop();

		var pos = 0;
		var left, right;
		while(pos < queue.length){
			left = pos*2 + 2;
			right = pos*2 + 1;

			if(right < queue.length && left >= queue.length){
				if(queue[right].key < queue[pos].key){
					var temp = queue[right];
					queue[right] = queue[pos];
					queue[pos] = temp;
					pos = right;
				}
				else{
					break;
				}
			}
			else if(left < queue.length){
				var swapPos = left;
				if(queue[right].key < queue[left].key){
					swapPos = right;
				}
				if(queue[swapPos].key < queue[pos].key){
					var temp = queue[swapPos];
					queue[swapPos] = queue[pos];
					queue[pos] = temp;
				}
				pos = swapPos;
			}
			else{
				break;
			}
		}

		return smallest;
	}
}