import heroImage from "@/assets/new.png"  ; 
const LargeHero = () => {
  return (
    <section className="w-full mb-16 px-6 p-6">
      <div className="w-full aspect-[16/9] mb-3 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Sports clothing collection" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="">
        <h2 className="text-sm font-normal text-foreground mb-1">
          Performance Redefined
        </h2>
        <p className="text-sm font-light text-foreground">
          Athletic wear engineered for champions
        </p>
      </div>
    </section>
  );
};

export default LargeHero;