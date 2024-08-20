import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel as CarouselRs } from "react-responsive-carousel";
import Image from "next/image";
import { FC } from "react";

type CarouselProps = {
  images: string[];
};

const Carousel: FC<CarouselProps> = ({ images }) => {
  const renderImages = (): JSX.Element[] => {
    return (
      images.map((image, index) => {
        return (
          <div key={index}>
            <Image
              src={image}
              alt={`Image ${index}`}
              width="0"
              height="0"
              sizes="100vw"
              style={{
                width: "100%",
                height: "100%",
                maxHeight: "400px",
              }}
            />
          </div>
        );
      }) || []
    );
  };

  return (
    <CarouselRs autoPlay={true} interval={5000} infiniteLoop showThumbs={false}>
      {renderImages()}
    </CarouselRs>
  );
};

export default Carousel;
