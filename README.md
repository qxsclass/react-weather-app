# Weather App with Next.js（Next.js天气应用）

This project is a full-stack web application built using the Next.js framework, integrating both the frontend with React and the backend with Node.js. It leverages the Open Weather Map's free API to fetch weather data for cities around the world.

本项目是一个使用Next.js框架构建的全栈Web应用，集成了React前端和Node.js后端。它利用Open Weather Map的免费API来获取全球城市的天气数据。

## Author

* 邢桂宇 Sam Xing

## 联系方式：
* xingguiyu@foxmail.com

## Features（功能特点）

- **Multi-language Support**: Offers interfaces in multiple languages, making the app accessible to a wider audience.
- **City Weather Search**: Users can enter the name of a city in English to fetch the weather information.
- **Weather Dashboard**: Provides current weather conditions along with a hourly forecast and a 5-day weather forecast.
- **Modular Architecture**: The project is structured with a comprehensive frontend and backend architecture, allowing for scalability and further development.
- **High Encapsulation**: Features like the AXIOS API client and server-side API data processing are highly encapsulated to ensure code reusability and maintainability.
- **Component-Based Development**: Facilitates reusability through modular component-based development practices.
- **Clean and Intuitive UI**: The user interface is designed to be clean and intuitive, ensuring clear communication of information.
- **Integrated Features**: Includes implemented functionalities such as multi-language support, debounce on the frontend for input fields, error handling, and more.

- **多语言支持**：提供多语言界面，使应用可面向更广泛的用户群体。
- **城市天气查询**：用户可以输入城市的英文名称来获取天气信息。
- **气象面板**：提供当前天气状况、小时预报和未来5天的天气预报。
- **模块化架构**：项目具有全面的前端和后端架构，可扩展性强，便于进一步开发。
- **高度封装**：如API AXIOS客户端和服务器端API数据处理等功能高度封装，确保代码的可重用性和可维护性。
- **组件化开发**：通过模块化组件开发实践促进重用性。
- **清爽直观的UI界面**：用户界面设计清新直观，确保信息传达清晰。
- **集成功能**：已实现的功能包括多语言支持、前端输入字段的防抖处理、错误处理等。

## Technical Aspects（技术点）

- **UI Design**: The application features a clean and minimalistic UI that focuses on efficient information delivery.
- **Full-Stack Capabilities**: This project showcases full-stack development capabilities with Next.js, a framework that's still gaining traction in the domestic market.
- **Backend Service Module and Frontend Component Encapsulation**: Demonstrates effective encapsulation strategies that enhance code organization and maintenance.
- **Coding Standards**: Adheres to best coding practices, ensuring the codebase is clean, well-organized, and professional.
- **Multi-Language Adaptation**: Implements a robust solution for multi-language support, enhancing user experience.
- **Temperature Visualization Algorithm**: Utilizes a custom algorithm to visually represent temperature changes and trends effectively.
- **Real-Time Data Delivery**: Ensures that the weather data is up-to-date and returned to the user without delays.
- **API Data Handling**: Efficiently processes and handles data fetched from external APIs.
- **Type Definitions**: Uses TypeScript to ensure data types are consistent and correctly managed across the project.
- **Deployment and Production**: Outlines the steps and strategies for deploying and maintaining the application in a production environment.

- **UI设计**：应用特有的简洁明快的UI，注重高效信息传达。
- **全栈能力**：该项目展示了使用国内市场逐渐流行的Next.js框架的全栈开发能力。
- **后端服务模块与前端组件封装**：展示了有效的封装策略，增强了代码的组织和维护。
- **编码标准**：遵循最佳编码实践，确保代码库整洁、有序且专业。
- **多语言适配**：实施了稳健的多语言支持解决方案，提升了用户体验。
- **温度条视觉传达算法**：使用自定义算法有效地视觉表示温度变化和趋势。
- **信息实时返回**：确保天气数据是最新的，并且无延迟地返回给用户。
- **API数据处理**：有效处理从外部API获取的数据。
- **类型定义**：使用TypeScript确保项目中数据类型的一致性和正确管理。
- **部署与上线**：概述了在生产环境部署和维护应用的步骤和策略。

## Getting Started（开始使用）

To run this project locally, follow these steps:

1. **Clone the repository**
```bash
git clone https://github.com/your-repository/weather-app-nextjs.git
```
   
2.**Install dependencies**
```bash
  npm install
```
3.	Set up environment variables
Create a .env file at the root of your project and add the following, you can see more details in .env.example file:
```aiignore
NEXT_PUBLIC_OPENWEATHER_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_BAIDU_TRANSLATE_APPID=YOUR_BAIDU_APPID
NEXT_PUBLIC_BAIDU_TRANSLATE_KEY=YOUR_BAIDU_KEY
GOOGLE_TRANSLATE_API_KEY=your_api_key_here
```

4. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

5. **Build for production**
```bash
npm run build
```
Followed by
```bash
npm start
```
## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License（许可证）
This project is licensed under the MIT License - see the LICENSE.md file for details.