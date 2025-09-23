import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

const About = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto max-w-3xl py-12 px-4">
        <Card className="overflow-hidden">
          <CardContent className="p-12 flex items-center justify-center">
          <p className="text-xl text-center font-medium">
            Sản phẩm này là của đề tài QG.24.80
          </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
