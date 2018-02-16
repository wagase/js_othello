// JavaScript source code

// 即実行の無名function 定義にしてグローバル変数を汚さない クロージャ
(function () {
	// local 変数
	var board = [];
	var peace = [];
	var turn;
	var preboard = [];
	var com;
	var com2;

	// onload
	$(function () {
		// peaceの定義
		peace = [$("#cell").clone(true),
				$("#cell").clone(true).append($("#black")),
				$("#cell").clone(true).append($("#white")),
				$("#cell").clone(true).css("background-color", "#0ee")];
		turn = 1;
		initBoard();
		initPeace();
		showBoard();
		clickEvent();
	});

	// なにもないボードの作成
	function initBoard(){
		// board配列の作成 １マス分多めに取る
		for (var i = -1; i <= 8; i++) {
			board[i] = [];
			preboard[i] = [];
			for (var j = -1; j <= 8; j++) {
				// cell = 0
				board[i][j] = 0;
				preboard[i][j] = 0;
			};
		};
	};

	// コマの初期配置
	function initPeace() {
		// Black = 1
		// White = 2
		board[3][3] = 2;
		board[3][4] = 1;
		board[4][3] = 1;
		board[4][4] = 2;
	};

	// ボードの描写
	function showBoard() {
		// メインの初期化
		var b = document.getElementById("main");
		// すべての子供要素に対して
		while (b.firstChild) {
			// それ自身を削除する
			b.removeChild(b.firstChild);
		};
		for (var x = 0; x < 8; x++) {
			for (var y = 0; y < 8; y++) {
				// ピース状態の完全コピーをボードに代入
				var c = peace[board[x][y]].clone(true);
				// 座標を与える
				$(c).attr("data-position-x", x);
				$(c).attr("data-position-y", y);
				// CSSで位置を変える
				$(c).css("left", x * 32 + "px").css("top", y * 32 + "px");

				// 解放度の表示がONの時
				if ($("#release").prop("checked")) {
					f = getRelease(x, y);
					if (checkRevers(x, y, false)) {
						$(c).html(f).css("text-align", "center");
					}
				} else {
					if (board[x][y] == 3) {
						$(c).html("");
					}
				}
				// mainにcellを加える
				$("#main").append(c);
			};
		};
	};

	// CELLの初期化
	function refreshCell() {
		for (var x = 0; x < 8; x++) {
			for (var y = 0; y < 8; y++) {
				if (!(board[x][y] == 1 || board[x][y] == 2)) {
					board[x][y] = 0;
				}
			}
		}
	};

	// ターン表示
	function turnInfo() {
		if (turn == 1) {
			$("#info").html("黒の手番です");
		} else if (turn == 2) {
			$("#info").html("白の手番です");
		}
	}

	// ひっくり返せるかどうかの判定
	function checkRevers(x, y, flap) {
		// 現在地に既に駒がある時
		if (board[x][y] == 1 || board[x][y] ==2) { return false; };
		ret = false;
		// 自分のまわり八方を調べる
		for (var dx = -1; dx <= 1; dx++) {
			for (var dy = -1; dy <= 1; dy++) {
				var nx = x + dx;
				var ny = y + dy;
				var flg = false;
				var ret;
				// 座標が自分自身の時はなにもせずに次へ
				if (nx == x && ny == y) { continue; };
				// 周りが自分と同じ色でないとき
				while (board[nx][ny] == 3 - turn) {
					nx += dx;
					ny += dy;
					flg = true;
				};
				// 最後が自分と同じ色の時
				if (flg && board[nx][ny] == turn) {
					if (flap) {
						nx = x + dx;
						ny = y + dy;
						while (board[nx][ny] == 3 - turn) {
							board[nx][ny] = turn;
							nx += dx;
							ny += dy;
						};
					}
					ret = true;
				};
			};
		};
		return ret;
	};

	// おけるところの色を変える
	function changeColor(cc) {
		var f=0;
		for (var x = 0; x < 8; x++) {
			for (var y = 0; y < 8; y++) {
				// おけるところがある時
				if (checkRevers(x, y, false)) {
					if (cc && board[x][y] == 0) {
						board[x][y] = 3;
					};
					f++;
				};
			};
		};
		return f;
	}

	// 解放度を計算
	function getRelease(x, y) {
		var f = 0;
		// 現在のboardの状態を保存
		for (var i = 0; i < 8; i++) {
			for (var j = 0; j < 8; j++) {
				preboard[i][j] = board[i][j];
			};
		};
		// 実際に置いてみる
		refreshCell();
		if (checkRevers(x, y, true)) {
			// おいた後つぎに相手がおける数を数える
			board[x][y] = turn;
			turn = 3 - turn;
			f = changeColor(false);
			turn = 3 - turn;
		};
		// 現在のboardの状態を元に戻す
		for (var i = 0; i < 8; i++) {
			for (var j = 0; j < 8; j++) {
				board[i][j] = preboard[i][j];
			};
		};
		return f;
	}

	//未来の自分コマの数を計算
	function countPeace(x, y) {
		var m = 0;
		// 現在のboardの状態を保存
		for (var i = 0; i < 8; i++) {
			for (var j = 0; j < 8; j++) {
				preboard[i][j] = board[i][j];
			};
		};
		// 実際に置いてみる
		refreshCell();
		if (checkRevers(x, y, true)) {
			board[x][y] == turn;
			// おいた後の自分の駒の状態を数える
			for (var i = 0; i < 8; i++) {
				for (var j = 0; j < 8; j++) {
					if (board[i][j] == turn) {
						m++
					}
				}
			}
		};
		// 現在のboardの状態を元に戻す
		for (var i = 0; i < 8; i++) {
			for (var j = 0; j < 8; j++) {
				board[i][j] = preboard[i][j];
			};
		};
		return m;
	}

	// 現在の自分のコマの数を数える
	function getMyNumber() {
		var n = 0;
		for (var x = 0; x < 8; x++) {
			for (var y = 0; y < 8; y++) {
				if (board[x][y] == turn) {
					n++;
				}
			};
		};
		return n;
	}

	// 現在の相手のコマの数を数える
	function getEnemyNumber() {
		var n = 0;
		for (var x = 0; x < 8; x++) {
			for (var y = 0; y < 8; y++) {
				if (board[x][y] == 3 - turn) {
					n++;
				}
			};
		};
		return n;
	}

	// 実際に置いてみてコマの数の差を返す
	function tryput(x, y) {
		// 実際に置いてみる
		refreshCell();
		var myn = 0; enn = 0;
		if (checkRevers(x, y, true)) {
			board[x][y] == turn;
			// おいた後の駒の状態を数える
			var myn = getMyNumber();
			var enn = getEnemyNumber();
		};
		return myn-enn;
	}

	// コンピュータの動き
	function comMove() {
		if (turn == com) {
			if ($("#Level1").prop("checked")) {
				comMoveL1();
			} else if ($("#Level2").prop("checked")) {
				comMoveL2();
			} else if ($("#Level3").prop("checked")) {
				comMoveL3();
			} else if ($("#Level4").prop("checked")) {
				comMoveL4();
			} else if ($("#Level5").prop("checked")) {
				comMoveL5();
			} else if ($("#Level6").prop("checked")) {
				comMoveL6(com);
			}

			// ターンを譲る
			turn = 3 - turn;
			turnInfo();
		};

		f = changeColor(false);
		// 手番を変えてもおけるところがないとき
		if (f == 0) {
			turn = 3 - turn;
			f = changeColor(false);
			// それでもおけるところがないとき
			if (f == 0) {
				gameOver();
				return;
			}
			// ターンをもどして
			turn = 3 - turn;
		}
		if ($("#vsCom2").prop("checked")) {
			comMove2();
		}
		
	}

	function comMove2() {
		if (com2 != com) {
			if (turn == com2) {
				if ($("#Level2_1").prop("checked")) {
					comMoveL1();
				} else if ($("#Level2_2").prop("checked")) {
					comMoveL2();
				} else if ($("#Level2_3").prop("checked")) {
					comMoveL3();
				} else if ($("#Level2_4").prop("checked")) {
					comMoveL4();
				} else if ($("#Level2_5").prop("checked")) {
					comMoveL5();
				} else if ($("#Level6").prop("checked")) {
					comMoveL6(com2);
				}
				// ターンを譲る
				turn = 3 - turn;
				turnInfo();
			};
			f = changeColor(false);
			// 手番を変えてもおけるところがないとき
			if (f == 0) {
				// ターンを譲って
				turn = 3 - turn;
				f = changeColor(false);
				// それでもおけるところがないとき
				if (f == 0) {
					gameOver();
					return;
				}
				// ターンをもどして
				turn = 3 - turn;
			}
			if ($("#vsCom").prop("checked")) {
				comMove();
			}
		}
	}

	// レベル１
	function comMoveL1(){
		for (var x = 0; x < 8; x++) {
			for (var y = 0; y < 8; y++) {
				// おけるところがある時
				if (checkRevers(x, y, true)) {
					board[x][y] = turn;
					// 終了
					return 0;
				};
			};
		};
	}

	// レベル２
	function comMoveL2() {
		// 四隅に置けるならすぐに置く
		for (var x = 0; x < 8; x+= 7) {
			for (var y = 0; y < 8; y+= 7) {
				if (checkRevers(x, y, true)) {
					board[x][y] = turn;
					// 終了
					return 0;
				};
			};
		};
		for (var x = 0; x < 8; x++) {
			for (var y = 0; y < 8; y++) {
				// X地点には最後まで置かない
				if ((x == 1 && y == 1) || (x == 1 && y == 6) || (x == 6 && y == 1) || (x == 6 && y == 6)) { continue };
				// おけるところがある時
				if (checkRevers(x, y, true)) {
					board[x][y] = turn;
					// 終了
					return 0;
				};
			};
		};
		// どうしても置けないならXに置く
		for (var x = 1; x < 8; x += 5) {
			for (var y = 1; y < 8; y += 5) {
				if (checkRevers(x, y, true)) {
					board[x][y] = turn;
					// 終了
					return 0;
				};
			};
		};
		comMoveL1();
	}

	// レベル３
	function comMoveL3() {
		// 四隅に置けるならすぐに置く
		for (var x = 0; x < 8; x += 7) {
			for (var y = 0; y < 8; y += 7) {
				if (checkRevers(x, y, true)) {
					board[x][y] = turn;
					// 終了
					return 0;
				};
			};
		};
		// X地点以外の解放度を計算して一番少ない地点を取得
		var r0 = 99; x0 = -1; y0 = -1;
		for (var x = 0; x < 8; x++) {
			for (var y = 0; y < 8; y++) {
				// X地点には最後まで置かない
				if ((x == 1 && y == 1) || (x == 1 && y == 6) || (x == 6 && y == 1) || (x == 6 && y == 6)) { continue };
				r1 = getRelease(x, y);
				if (r1 == 0) {
					// 解放度が０でしかもおける時は相手が必ずパスになるので積極的に置く
					if (checkRevers(x, y, true)) {
						board[x][y] = turn;
						// 終了
						return 0;
					}
				}
				if (r0 > r1 && r1 !=0) {
					r0 = r1;
					x0 = x;
					y0 = y;
				}
			};
		};
		// 一番少ない地点にコマを置く
		if (x0 >= 0 && y0 >= 0) {
			if (checkRevers(x0, y0, true)) {
				board[x0][y0] = turn;
				// 終了
				return 0;
			};
		};
		// どうしても置けないならXに置く
		for (var x = 1; x < 8; x += 5) {
			for (var y = 1; y < 8; y += 5) {
				if (checkRevers(x, y, true)) {
					board[x][y] = turn;
					// 終了
					return 0;
				};
			};
		};
		comMoveL1();
	}

	// レベル４
	function comMoveL4() {
		// 四隅に置けるならすぐに置く
		for (var x = 0; x < 8; x += 7) {
			for (var y = 0; y < 8; y += 7) {
				if (checkRevers(x, y, true)) {
					board[x][y] = turn;
					// 終了
					return 0;
				};
			};
		};
		// CとX地点以外の解放度を計算して一番少ない地点を取得
		var r0 = 99; x0 = -1; y0 = -1;
		for (var x = 0; x < 8; x++) {
			for (var y = 0; y < 8; y++) {
				// CとX地点には最後まで置かない
				if ((x == 1 && y == 1) || (x == 1 && y == 6) || (x == 6 && y == 1) || (x == 6 && y == 6) || 
					(x == 0 && y == 1) || (x == 0 && y == 6) || (x == 1 && y == 0) || (x == 1 && y == 7) || 
					(x == 6 && y == 0) || (x == 6 && y == 7) || (x == 7 && y == 1) || (x == 7 && y == 6)) { continue };
				r1 = getRelease(x, y);
				if (r1 == 0) {
					// 解放度が０でしかもおける時は相手が必ずパスになるので積極的に置く
					if (checkRevers(x, y, true)) {
						board[x][y] = turn;
						// 終了
						return 0;
					}
				}
				if (r0 > r1 && r1 != 0) {
					r0 = r1;
					x0 = x;
					y0 = y;
				}
			};
		};
		// 一番少ない地点にコマを置く
		if (x0 >= 0 && y0 >= 0) {
			if (checkRevers(x0, y0, true)) {
				board[x0][y0] = turn;
				// 終了
				return 0;
			};
		};

		// それでも置けないならCに置く
		for (var x = 0; x < 8; x ++) {
			for (var y = 0; y < 8; y++) {
				if (!((x == 0 && y == 1) || (x == 0 && y == 6) || (x == 1 && y == 0) || (x == 1 && y == 7) ||
					(x == 6 && y == 0) || (x == 6 && y == 7) || (x == 7 && y == 1) || (x == 7 && y == 6))) { continue };
				if (checkRevers(x, y, true)) {
					board[x][y] = turn;
					// 終了
					return 0;
				};
			};
		};

		// どうしても置けないならXに置く
		for (var x = 1; x < 8; x += 5) {
			for (var y = 1; y < 8; y += 5) {
				if (checkRevers(x, y, true)) {
					board[x][y] = turn;
					// 終了
					return 0;
				};
			};
		};
		comMoveL1();
	}

	// レベル5
	function comMoveL5() {
		// 四隅に置けるならすぐに置く
		for (var x = 0; x < 8; x += 7) {
			for (var y = 0; y < 8; y += 7) {
				if (checkRevers(x, y, true)) {
					board[x][y] = turn;
					// 終了
					return 0;
				};
			};
		};
		// CとX地点以外の解放度を計算して一番少ない地点を取得
		var r0 = 99; x0 = -1; y0 = -1; x2 = -1, y2 = -1;
		for (var x = 0; x < 8; x++) {
			for (var y = 0; y < 8; y++) {
				// CとX地点には最後まで置かない
				if ((x == 1 && y == 1) || (x == 1 && y == 6) || (x == 6 && y == 1) || (x == 6 && y == 6) ||
					(x == 0 && y == 1) || (x == 0 && y == 6) || (x == 1 && y == 0) || (x == 1 && y == 7) ||
					(x == 6 && y == 0) || (x == 6 && y == 7) || (x == 7 && y == 1) || (x == 7 && y == 6)) { continue };
				r1 = getRelease(x, y);
				if (r1 == 0) {
					// 解放度が０でしかもおける時は相手が必ずパスになるので積極的に置く
					if (checkRevers(x, y, true)) {
						board[x][y] = turn;
						// 終了
						return 0;
					}
				}
				if (r0 >= r1 && r1 != 0) {
					// もしも同じ解放度のものが複数あるなら
					if (r1 == r0) {
						var x2 = x;
						var y2 = y;
					} else {
						r0 = r1;
						x0 = x;
						y0 = y;
						x2 = -1;
						y2 = -1;
					}
					
				}
			};
		};
		var m0 = 0; m2 = 0;
		// おいてみたところの駒の数を比べて少ない方を選択
		if (x0 >= 0 && y0 >= 0) {
			m0 = countPeace(x0, y0);
			if (x2 > 0 && y2 > 0) {
				m2 = countPeace(x2, y2);
				if (m0 > m2) {
					x0 = x2;
					y0 = y2;
				}
			}
			// 一番少ない地点にコマを置く
			if (checkRevers(x0, y0, true)) {
				board[x0][y0] = turn;
				// 終了
				return 0;
			};
		}
		

		// それでも置けないならCに置く
		for (var x = 0; x < 8; x++) {
			for (var y = 0; y < 8; y++) {
				if (!((x == 0 && y == 1) || (x == 0 && y == 6) || (x == 1 && y == 0) || (x == 1 && y == 7) ||
					(x == 6 && y == 0) || (x == 6 && y == 7) || (x == 7 && y == 1) || (x == 7 && y == 6))) { continue };
				if (checkRevers(x, y, true)) {
					board[x][y] = turn;
					// 終了
					return 0;
				};
			};
		};

		// どうしても置けないならXに置く
		for (var x = 1; x < 8; x += 5) {
			for (var y = 1; y < 8; y += 5) {
				if (checkRevers(x, y, true)) {
					board[x][y] = turn;
					// 終了
					return 0;
				};
			};
		};
		comMoveL1();
	}

	// レベル6 
	function comMoveL6(me) {
		// 現在のboardの状態を保存
		for (var i = 0; i < 8; i++) {
			for (var j = 0; j < 8; j++) {
				preboard[i][j] = board[i][j];
			};
		};
		var tempArrayX = [];
		var tempArrayY = [];
		// ノード数
		var node = [];
		// 残り手数計算
		res =64;
		for (var x = 0; x < 8; x++) {
			for (var y = 0; y < 8; y++) {
				if (board[x][y] == 1 || board[x][y] == 2) {
					res--;
				};
			};
		};
		var i = 0;
		var j = 0;
		node[j] = [];
		// 残りが4手しかないなら完全解析を試みる 最大4!通り
		if (res == 4) {
			// 次におけるリストを取得
			for (var x = 0; x < 8; x++) {
				for (var y = 0; y < 8; y++) {
					// おけるところがある時
					if (checkRevers(x, y, false)) {
						// 実際に置いてみる
						// 自分-相手をそのまま評価値とする
						node[j][i] = tryput(x, y)
						// ターンをすすめてノードもすすめる
						turn = 3 - turn;
						j++;
						i1 = 0;
						// 次におけるリストを取得
						for (var x1 = 0; x1 < 8; x1++) {
							for (var y1 = 0; y1 < 8; y1++) {
								// おけるところがある時
								if (checkRevers(x1, y1, false)) {
									// 実際に置いてみる
									// 自分-相手をそのまま評価値とする
									node[j][i1] = tryput(x1, y1)
								}
								// ターンをすすめてノードもすすめる
								turn = 3 - turn;
								j++;


								i1++;
							}
						}


						i++;
					};
				};
			};
			for (i; i <= 0; i--) {
				x = tempArrayX[i];
				y = tempArrayY[i];
				tryput(x, y)
				// 自分-相手をそのまま評価値とする
				node[j][i] = myn - enn;
				// ターンを動かして
				turn = 3 - turn;
				j++;
				// 実際に置いてみる
				refreshCell();
				var myn = 0; enn = 0;
				x = tempArrayX[i];
				y = tempArrayY[i];
				if (checkRevers(x, y, true)) {
					board[x][y] == turn;
					// おいた後の駒の状態を数える
					var myn = getMyNumber();
					var enn = getEnemyNumber();
				};
				// 自分-相手をそのまま評価値とする
				node[j][i] = myn - enn;
			}
			


			;yon = getMyNumber(3-me)
			
			{
			}
		}





		// 現在のboardの状態を元に戻す
		for (var i = 0; i < 8; i++) {
			for (var j = 0; j < 8; j++) {
				board[i][j] = preboard[i][j];
			};
		};



		// 四隅に置けるならすぐに置く
		for (var x = 0; x < 8; x += 7) {
			for (var y = 0; y < 8; y += 7) {
				if (checkRevers(x, y, true)) {
					board[x][y] = turn;
					// 終了
					return 0;
				};
			};
		};
		// CとX地点以外の解放度を計算して一番少ない地点を取得
		var r0 = 99; x0 = -1; y0 = -1; x2 = -1, y2 = -1;
		for (var x = 0; x < 8; x++) {
			for (var y = 0; y < 8; y++) {
				// CとX地点には最後まで置かない
				if ((x == 1 && y == 1) || (x == 1 && y == 6) || (x == 6 && y == 1) || (x == 6 && y == 6) ||
					(x == 0 && y == 1) || (x == 0 && y == 6) || (x == 1 && y == 0) || (x == 1 && y == 7) ||
					(x == 6 && y == 0) || (x == 6 && y == 7) || (x == 7 && y == 1) || (x == 7 && y == 6)) { continue };
				r1 = getRelease(x, y);
				if (r1 == 0) {
					// 解放度が０でしかもおける時は相手が必ずパスになるので積極的に置く
					if (checkRevers(x, y, true)) {
						board[x][y] = turn;
						// 終了
						return 0;
					}
				}
				if (r0 >= r1 && r1 != 0) {
					// もしも同じ解放度のものが複数あるなら
					if (r1 == r0) {
						var x2 = x;
						var y2 = y;
					} else {
						r0 = r1;
						x0 = x;
						y0 = y;
						x2 = -1;
						y2 = -1;
					}

				}
			};
		};
		var m0 = 0; m2 = 0;
		// おいてみたところの駒の数を比べて少ない方を選択
		if (x0 >= 0 && y0 >= 0) {
			m0 = countPeace(x0, y0);
			if (x2 > 0 && y2 > 0) {
				m2 = countPeace(x2, y2);
				if (m0 > m2) {
					x0 = x2;
					y0 = y2;
				}
			}
			// 一番少ない地点にコマを置く
			if (checkRevers(x0, y0, true)) {
				board[x0][y0] = turn;
				// 終了
				return 0;
			};
		}


		// それでも置けないならCに置く
		for (var x = 0; x < 8; x++) {
			for (var y = 0; y < 8; y++) {
				if (!((x == 0 && y == 1) || (x == 0 && y == 6) || (x == 1 && y == 0) || (x == 1 && y == 7) ||
					(x == 6 && y == 0) || (x == 6 && y == 7) || (x == 7 && y == 1) || (x == 7 && y == 6))) { continue };
				if (checkRevers(x, y, true)) {
					board[x][y] = turn;
					// 終了
					return 0;
				};
			};
		};

		// どうしても置けないならXに置く
		for (var x = 1; x < 8; x += 5) {
			for (var y = 1; y < 8; y += 5) {
				if (checkRevers(x, y, true)) {
					board[x][y] = turn;
					// 終了
					return 0;
				};
			};
		};
		comMoveL1();
	}

	// GameOver
	function gameOver() {
		showBoard();
		var w=0; b=0;
		for (var x = 0; x < 8; x++) {
			for (var y = 0; y < 8; y++) {
				if (board[x][y] == 1) {
					b++
				} else if (board[x][y] == 2) {
					w++
				};
			};
		};
		if (b > w) {
			$("#info").html("黒の勝ち！黒" + b + "個、白" + w + "個");
		} else if (b < w) {
			$("#info").html("白の勝ち！黒" + b + "個、白" + w + "個");
		} else {
			$("#info").html("引き分け！黒" + b + "個、白" + w + "個");
		}
		turn = 0;
		$("#continue").css("display", "block");
	}



	//*************
	//CellのClickイベント onloadでDOMの描写が終わった後に定義
	//*************/
	function clickEvent() {
		var f;
		// すべてのid cellについて クリックした時 #cellだとできない
		$("[id=cell]").on("click", function () {
			// 座標を取得
			var x = Number($(this).attr("data-position-x"));
			var y = Number($(this).attr("data-position-y"));
			// なにもないとき
			if (board[x][y] == 0 || board[x][y] == 3) {
				refreshCell();
				// おけるところがある時
				if (checkRevers(x, y, true)) {
					$("#alert").html("");
					board[x][y] = turn;
					// 手番変更
					turn = 3 - turn;
					f = changeColor(false);
					// 手番を変えておけるところがないとき
					if (f == 0) {
						// 手番変更
						turn = 3 - turn;
						f = changeColor(false);
						// もう一度手番を変えてもおけるところがないとき
						if (f == 0) {
							gameOver();
							return;
						} else {
							// せっかくパス機能があるので手番を戻す
							// 手番変更
							if (!$("#autoPass").prop("checked")) {
								turn = 3 - turn;
							} else {
								$("#alert").html("おけるところがないため自動でパスされました");
							}
						}
					}
					if ($("#vsCom").prop("checked")) {
						comMove();
					}
					if ($("#vsCom2").prop("checked")) {
						comMove2();
					}
					turnInfo();
				}
				if ($("#hint").prop("checked")) {
					var f = changeColor(true);
				}
				showBoard();
				// DOMを書き換えているので再定義
				$("[id=cell]").off("click");
				clickEvent();
			};
		});
	};

	$(function () {

		// PASS機能
		$("#pass").click(function () {
			// 連打防止
			if ($("#alert").html() == "") {
				var f = changeColor(true);
				if (f == 0) {
					// 手番変更
					turn = 3 - turn;
					turnInfo();
					f = changeColor(false);
					// 手番を変えてもおけるところがないとき
					if (f == 0) {
						gameOver();
						return;
					}
				} else {
					$("#alert").html("まだおけるところがあるのでパスできません");
				};
				if ($("#vsCom").prop("checked")) {
					comMove();
				}
				if ($("#vsCom2").prop("checked")) {
					comMove2();
				}
				if ($("#hint").prop("checked")) {
					f = changeColor(true);
				};
				showBoard();
				// DOMを書き換えているので再定義
				$("[id=cell]").off("click");
				clickEvent();
			}
		});

		// ヒントモード
		$("#hint").change(function () {
			if ($("#hint").prop("checked")) {
				var f = changeColor(true);
			} else {
				refreshCell();
			};
			showBoard();
			// DOMを書き換えているので再定義
			$("[id=cell]").off("click");
			clickEvent();
		});

		// 解放度表示
		$("#release").change(function () {
			showBoard();
			// DOMを書き換えているので再定義
			$("[id=cell]").off("click");
			clickEvent();
		});

		// COMの手番設定
		$("#vsCom").change(function () {
			if ($("#vsCom").prop("checked")) {
				if ($("#turnW").prop("checked")) {
					com = 2;
				} else {
					com = 1;
				}
				// もしも今comの手番だったらすぐに指す
				if (com == turn) {
					turnInfo();
					comMove();
				}
			}
			showBoard();
			// DOMを書き換えているので再定義
			$("[id=cell]").off("click");
			clickEvent();
		});

		// COMの手番設定
		$("[name=turn]").change(function () {
			if ($("#vsCom").prop("checked")) {
				if ($("#turnW").prop("checked")) {
					com = 2;
				} else {
					com = 1;
				}
				// もしも今comの手番だったらすぐに指す
				if (com == turn) {
					turnInfo();
					comMove();
				}
			}
			showBoard();
			// DOMを書き換えているので再定義
			$("[id=cell]").off("click");
			clickEvent();
		});

		// COM2の手番設定
		$("#vsCom2").change(function () {
			if ($("#vsCom2").prop("checked")) {
				if ($("#turn2W").prop("checked")) {
					com2 = 2;
				} else {
					com2 = 1;
				}
				// もしも今com2の手番だったらすぐに指す
				if (com2 == turn) {
					turnInfo();
					comMove2();
				}
			}
			showBoard();
			// DOMを書き換えているので再定義
			$("[id=cell]").off("click");
			clickEvent();
		});

		// COM2の手番設定
		$("[name=turn2]").change(function () {
			if ($("#vsCom2").prop("checked")) {
				if ($("#turn2W").prop("checked")) {
					com2 = 2;
				} else {
					com2 = 1;
				}
				// もしも今comの手番だったらすぐに指す
				if (com2 == turn) {
					turnInfo();
					comMove2();
				}
			}
			showBoard();
			// DOMを書き換えているので再定義
			$("[id=cell]").off("click");
			clickEvent();
		});

		$("#continue").click(function () {
			$("#continue").css("display", "none")
			turn = 1;
			initBoard();
			initPeace();
			turnInfo();
			
			if ($("#vsCom").prop("checked")) {
				comMove();
			}
			if ($("#vsCom2").prop("checked")) {
				comMove2();
			}

			showBoard();
			clickEvent();
		});

	});
	
})();