import "../App.css";
import "../styles/TopCreators.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

interface TopCreatorProps {
  imageUrl: string;
  name: string;
}

const TopCreators: React.FC = () => {
  const creators: TopCreatorProps[] = [
    {
      imageUrl: "./assets/image/darina.png",
      name: "Bakeyeva Darina",
    },
    {
      imageUrl: "./assets/image/alina.png",
      name: "Sagandykova Alina",
    },
    {
      imageUrl: "./assets/image/zhansaya.png",
      name: "Musabekova Zhansaya",
    },
    {
      imageUrl: "./assets/image/yedige.png",
      name: "Mazhit Yedige",
    },
    {
      imageUrl: "./assets/image/zhanarys.png",
      name: "Asan Zhanarys",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    ],
  };

  return (
    <section className="home_section_6">
      <img
        className="blur_image"
        src="./assets/image/blursection5.png"
        alt="blur"
      />
      <div className="container">
        <div className="title_content">
          <h2 className="title">Developers</h2>
        </div>
        <Slider {...settings}>
          {creators.map((creator, index) => (
            <div key={index} className="grid_card">
              <div className="card_description_inner">
                <div className="inner_content">
                  <img src={creator.imageUrl} alt="author" />
                  <div className="author_description">
                    <h3 className="author_title">{creator.name}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default TopCreators;
