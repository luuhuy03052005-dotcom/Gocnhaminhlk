import { siteData } from '../../config/siteData';
import { Typography } from '../ui/Typography';
import { RevealWrapper } from '../ui/RevealWrapper';
import { GrainOverlay, CurvedLines } from '../ui/SectionDecor';

export const HighlightSection = () => {
  const highlights = [
    {
      id: "1",
      title: "Nguyên liệu chân thật",
      desc: "Lựa chọn hạt cà phê và trà từ những vùng nguyên liệu chuẩn nhất, tôn vinh vị gốc nguyên bản.",
    },
    {
      id: "2",
      title: "Chăm chút thủ công",
      desc: "Mỗi ly nước được cân đo tỉ mỉ, đánh bọt kem muối bằng tay để tạo ra độ sánh mịn hoàn hảo.",
    },
    {
      id: "3",
      title: "Không gian kết nối",
      desc: "Sự yên tĩnh vừa vặn để làm việc, và cũng đủ gần gũi để chia sẻ những câu chuyện cùng nhau.",
    }
  ];

  return (
    <section className="bg-[#FDF6EE] py-20 md:py-28 relative overflow-hidden">
      <GrainOverlay />
      <CurvedLines />
      <div className="container max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center relative z-10">
        
        {/* Left Side: Visual 5 columns */}
        <div className="lg:col-span-5 h-full">
          <RevealWrapper delay={0.1} className="w-full">
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl shadow-xl bg-[#EBE0CF]">
                <img 
                  src={siteData.images.gallery[0]?.image}
                alt="Góc Nhà Mình Atmosphere" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </RevealWrapper>
        </div>

        {/* Right Side: Editorial List 7 columns */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <RevealWrapper delay={0.1}>
            <Typography variant="h2" className="mb-14 text-[#2C2017]">
              Điều giữ chân bạn.
            </Typography>
          </RevealWrapper>

          <div className="flex flex-col gap-12">
            {highlights.map((item, index) => (
              <RevealWrapper key={item.id} delay={0.1 * (index + 2)}>
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8 border-t border-[#EBE0CF] pt-8">
                  <div className="font-sans font-bold text-[#A06828] text-lg shrink-0 mt-1">
                    No. 0{item.id} —
                  </div>
                  <div className="flex flex-col gap-3">
                    <Typography variant="h3" className="text-[1.75rem]">
                      {item.title}
                    </Typography>
                    <Typography variant="body">
                      {item.desc}
                    </Typography>
                  </div>
                </div>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
