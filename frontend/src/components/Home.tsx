import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();

  // 開始ボタンをクリックしたとき、EzDataのポイントをリセットして、playingページに遷移
  const handleClick = () => {
    handleResetPoint();
    navigate('/playing');
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
    <button className="start-button" onClick={handleClick}>ゲーム開始</button>
  );
};
