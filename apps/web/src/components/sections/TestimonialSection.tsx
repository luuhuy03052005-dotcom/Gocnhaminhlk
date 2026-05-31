import { siteData } from '../../config/siteData';
import { Typography } from '../ui/Typography';
import { RevealWrapper } from '../ui/RevealWrapper';

export const TestimonialSection = () => {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container max-w-7xl mx-auto px-6">
        <RevealWrapper className="mb-16 md:mb-20 flex flex-col items-center">
          <Typography variant="badge" className="mb-6">
            Đánh giá từ khách hàng
          </Typography>
          <Typography variant="h2" className="text-center max-w-2xl">
            Không gian tĩnh, lòng người an.
          </Typography>
        </RevealWrapper>

        {/* 3 Columns Grid - No Gimmicks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {siteData.testimonials.map((review, index) => (
            <RevealWrapper key={index} delay={0.1 * (index + 2)} className="h-full">
              <div className="rounded-2xl p-8 md:p-10 bg-[#FDF6EE] flex flex-col h-full border border-[#EDE4D8]">
                <Typography variant="body" className="text-[1.125rem] md:text-[1.25rem] text-[#2C2017] mb-10 flex-1 leading-[1.7]">
                  {review.text}
                </Typography>

                <div className="flex items-center gap-4 mt-auto border-t border-[#EDE4D8] pt-6">
                  <div className="w-12 h-12 rounded-full bg-[#EBE0CF] flex items-center justify-center text-[#A06828] font-bold text-lg font-serif shrink-0">
                    {review.author[0]}
                  </div>
                  <div className="flex flex-col">
                    <Typography variant="h4" className="text-[1.125rem] font-bold mb-1">
                      {review.author}
                    </Typography>
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                         <div key={i} className="w-2 h-2 rounded-full bg-[#C8873A] opacity-80"></div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};
