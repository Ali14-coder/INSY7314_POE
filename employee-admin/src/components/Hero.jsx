// src/components/Hero.jsx
import { useNavigate } from "react-router-dom";
import { Shield, Database, Code } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="flex flex-col lg:flex-row">
            {/* Left Content */}
            <div className="p-8 lg:p-12 lg:w-1/2">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="text-blue-600" size={24} />
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  INTERNAL MANAGEMENT SYSTEM
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Streamlined Payment{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Operations
                </span>
              </h1>

              <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed">
                Optimize your payment processing workflow with our comprehensive
                management platform designed for efficiency and reliability.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/login")}
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Code size={20} />
                  Access Portal
                </button>
              </div>
            </div>

            {/* Right Content - Benefits Focus */}
            <div className="p-8 lg:p-12 lg:w-1/2 bg-gray-50 flex items-center justify-center">
              <div className="w-full max-w-md">
                <div className="relative group">
                  {/* Benefits Preview */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-300">
                    <div className="flex gap-2 mb-6">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>

                    {/* Benefits Showcase */}
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <Database
                          className="text-blue-600 mx-auto mb-2"
                          size={32}
                        />
                        <h3 className="font-semibold text-blue-800">
                          Operational Efficiency
                        </h3>
                        <p className="text-blue-600 text-sm mt-1">
                          Reduce processing time and manual effort
                        </p>
                      </div>

                      <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <Shield
                          className="text-purple-600 mx-auto mb-2"
                          size={32}
                        />
                        <h3 className="font-semibold text-purple-800">
                          Workflow Optimization
                        </h3>
                        <p className="text-purple-600 text-sm mt-1">
                          Streamlined approval processes
                        </p>
                      </div>

                      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <Code
                          className="text-green-600 mx-auto mb-2"
                          size={32}
                        />
                        <h3 className="font-semibold text-green-800">
                          Real-time Monitoring
                        </h3>
                        <p className="text-green-600 text-sm mt-1">
                          Instant visibility into payment status
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;