(function(){
	"use strict";
	function isOdd(num){
		return (num%2===1);
	}
	function isEven(num){
		return (num%2===0);
	}
	window.numbers = {
		isOdd: isOdd,
		isEven: isEven
	};
})();