import fetchMock from "jest-fetch-mock";
import "@testing-library/jest-dom";

fetchMock.enableMocks();

process.env.NODE_ENV = "TEST";
