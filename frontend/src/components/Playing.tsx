import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Data = {
  status: string
  data?: number[]
  errCode?: number
  errMsg?: string
};

export const Playing = () => {
  const [point, setPoint] = useState<number>(0);  // センサーを当てた的の数
  const [time, setTime] = useState<number>(0);  // 経過時間

  useEffect(() => {
    // 3秒ごとにデータを取得し、ポイントを更新
    const fetchData = async () => {
      try {
        await fetch('https://ezdata.m5stack.com/api/store/qrqP0JDlDZQsU9EU9j3eL6a2UNYTHU4d/pointList')
          .then(response => response.json())
          .then((data: Data) => {
            console.log(data)

            // data.dataには、pointListの配列がある
            if (data.data) {
              setPoint(data.data.length)

              // 全ての的を当てたとき、データの取得をやめ、経過時間の表示も止める
              if (data.data.length === 4) {
                clearInterval(pointInterval)
                clearInterval(timeInterval)
              }
            }
          });
      } catch (error) {
        console.error('error: ', error);
      }
    };

    const pointInterval = setInterval(fetchData, 3000);

    // 1秒ごとに経過時間を加算
    const countTime = () => {
      setTime((prev) => prev + 1)
    };

    const timeInterval = setInterval(countTime, 1000);

    return () => {
      clearInterval(pointInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const navigate = useNavigate();

  // 終了ボタンをクリックしたとき、EzDataのポイントをリセットして、トップページに遷移
  const handleClick = () => {
    if (window.confirm('ゲームを終了してもよろしいですか？')) {
      handleResetPoint();
      navigate('/');
    }
  };

  // EzDataのポイントをリセット
  const handleResetPoint = async () => {
    await fetch('https://ezdata.m5stack.com/api/store/qrqP0JDlDZQsU9EU9j3eL6a2UNYTHU4d/delete/pointList', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
      })
      .catch(error => {
        console.error('error', error)
      });
  };

  return (
    <>
      <div className='point'>{point} / 4</div>
      <div className="time">
        {(Math.floor(time / 60)).toString().padStart(2, '0')}
        ：
        {(time % 60).toString().padStart(2, '0')}
      </div>
      <button onClick={handleClick}>ゲーム終了</button>
      <style>{`
        .point {
          color: #f50967;
          font-size: 6rem;
          font-weight: 700;
        }
        .time {
          padding: 0 20px;
          margin: 20px 0 50px 0;
          font-size: 4rem;
          font-weight: 700;
          border: 1px solid black;
          border-radius: 50px;
        }
      `}</style>
    </>
  );
};
