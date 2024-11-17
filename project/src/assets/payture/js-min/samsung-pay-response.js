(function (global) {
  "use strict";

  var a64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  var a256 = "";
  var r64 = [];
  var i = -1;
  while (++i < 256) {
    a256 += String.fromCharCode(i);
  }
  var counter = 63;
  i = -1;
  while (counter >= 0) {
    var c = String.fromCharCode(++i);
    r64[i] = a64.indexOf(c);
    if (r64[i] !== -1) {
      --counter;
    }
  }

  function code(s, discard, alpha, beta, w1, w2) {
    var buffer = 0;
    var i = -1;
    var length = s.length;
    var result = '';
    var bitsInBuffer = 0;
    while (++i < length) {
      var c = s.charCodeAt(i);
      c = (alpha === null ? (c < 256 ? c : -1) : (c < alpha.length ? alpha[c] : -1));
      if (c === -1) {
        throw new RangeError();
      }
      buffer = (buffer << w1) + c;
      bitsInBuffer += w1;
      while (bitsInBuffer >= w2) {
        bitsInBuffer -= w2;
        var tmp = buffer >> bitsInBuffer;
        result += beta.charAt(tmp);
        buffer ^= tmp << bitsInBuffer;
      }
    }
    if (!discard && bitsInBuffer > 0) {
      result += beta.charAt(buffer << (w2 - bitsInBuffer));
    }
    return result;
  }

  global.b64encode = function (s) {
    s = String(s);
    s = code(s, false, null, a64, 8, 6);
    return s + "====".slice((s.length % 4) || 4);
  };

  global.b64decode = function (s) {
    s = String(s);
    var length = s.length;
    var k = -1;
    var result = "";
    var i = 0;
    while (++k < length + 1) {
      if (k === length || s.charAt(k) === "=") {
        var p = s.slice(i, k);
        i = k + 1;
        if (p.length % 4 === 1) {
          throw new RangeError();
        }
        result += code(p, true, r64, a256, 6, 8);
      }
    }
    return result;
  };

}(this));

function SamsungPayInit(){
	if (typeof QueryString.ref_id == 'undefined') {
		document.querySelector('#form').style.display = 'block';
		document.querySelector('#form').innerHTML = 'Error: ref_id is required';
	} else {
		SamsungPayComplete(QueryString.ref_id);
	}		
}

function PaySubmitMobile(data) {
	var b64string = '';
	if(window.btoa) {
		b64string = window.btoa(JSON.stringify(data));
	} else {
		b64string = window.b64encode(JSON.stringify(data));
	}
	
	$.ajax({
    url: '/apim/PaySubmitMobile?Json=true&ref_id='+QueryString.ref_id+
    '&PayToken='+encodeURIComponent(b64string)+
    '&EChequeCustomerContact=' + decodeURIComponent(QueryString.EChequeCustomerContact) +
    '&Data='+encodeURIComponent(QueryString.Key),
		type: 'post',
		headers: {
			"Content-type": "application/x-www-form-urlencoded; charset=UTF-8" 
		},
		dataType: 'json',
		success: function (response) {
			Payture.options = $.extend({}, Payture.defaults);
			if(response.Success) {
				Payture.options.onSuccess(response.RedirectUrl);					
			} else{
				Payture.options.onError(response.ErrCode, false, response.RedirectUrl);					
			}
		},
		error: function(err){
			console.log('Ошибка запроса: ' + err);
		}
	});
}
	
function SamsungPayComplete(ref_id) {
	$.ajax({
		url: '/peapi/SamsungPayTransactionsGET?Id=' + ref_id,
		type: 'get',
		headers: {
			"Content-type": "application/json",
			"X-Request-Id": new Date().getTime()  
		},
		dataType: 'json',
		success: function (data) {
			PaySubmitMobile(data);
		},
		error: function(err){
			console.log('Ошибка запроса: ' + err);
		}
	});		
}

var QueryString = function () {
	var query_string = {};
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if (typeof query_string[pair[0]] === "undefined") {
			query_string[pair[0]] = decodeURIComponent(pair[1]);
		} else if (typeof query_string[pair[0]] === "string") {
			var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
			query_string[pair[0]] = arr;
		} else {
			query_string[pair[0]].push(decodeURIComponent(pair[1]));
		}
	} 
	return query_string;
}();