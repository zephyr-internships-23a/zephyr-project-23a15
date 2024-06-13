import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import BannerOne from "@/assets/banner_one.jpeg";
import BannerTwo from "@/assets/banner_two.jpg";
import BannerThree from "@/assets/banner_three.jpg";
export default function Banner({ images }) {
  return (
    <div className="relative">
      <Carousel>
        <CarouselContent>
          {
            images?.length > 0 ?
              images.map((image, index) => (
                <CarouselItem key={index} className="relative">
                  <img className="w-full object-cover h-96" src={image} />
                </CarouselItem>
              ))
              :
              <>
                <CarouselItem className="relative">
                  <img className="w-full object-cover h-96" src={BannerOne} />
                  <h1 className="absolute color-red glass-morph p-4 text-lg  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    Best in class{" "}
                  </h1>
                </CarouselItem>
                <CarouselItem className="relative">
                  <img className="w-full object-cover h-96" src={BannerTwo} />
                  <h1 className="absolute color-red glass-morph p-4 text-lg  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    Get yourself into the vip areas!
                  </h1>
                </CarouselItem>
                <CarouselItem className="relative">
                  <img className="w-full object-cover h-96" src={BannerThree} />
                  <h1 className="absolute color-red glass-morph p-4 text-lg  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    We provide services everywhere!
                  </h1>
                </CarouselItem>

              </>
          }
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
