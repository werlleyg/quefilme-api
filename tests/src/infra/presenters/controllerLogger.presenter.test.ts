import { Request, Response } from "express";
import { ControllerLoggerPresenter } from "../../../../src/infra/presenters/controllerLogger.presenter";

describe("ControllerLoggerPresenter", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockTarget: any;

  beforeEach(() => {
    mockRequest = {
      baseUrl: "/test",
      headers: {
        "x-user-id": "123",
        "user-agent": "test-agent",
      },
      get ip() {
        return "127.0.0.1";
      },
      body: { test: "data" },
      params: { id: "1" },
      query: { filter: "active" },
    };

    mockResponse = {};

    mockTarget = {
      constructor: {
        name: "TestController",
      },
    };
  });

  it("should create metadata with all valid properties", () => {
    // Act
    const result = ControllerLoggerPresenter.metadata(
      [mockRequest, mockResponse],
      mockTarget,
      "testMethod",
      "TEST_EVENT",
    );

    // Assert
    expect(result).toEqual({
      controller: "TestController",
      method: "testMethod",
      path: "/test",
      timestamp: expect.any(String),
      userId: "123",
      userAgent: "test-agent",
      ip: "127.0.0.1",
      requestBody: { test: "data" },
      requestParams: { id: "1" },
      requestQuery: { filter: "active" },
      event: "TEST_EVENT",
    });
  });

  describe("Error scenarios", () => {
    it("should handle undefined headers", () => {
      // Arrange
      const reqWithoutHeaders = {
        ...mockRequest,
        headers: {} as Record<string, string>,
      };

      // Act
      const result = ControllerLoggerPresenter.metadata(
        [reqWithoutHeaders, mockResponse],
        mockTarget,
        "testMethod",
        "TEST_EVENT",
      );

      // Assert
      expect(result).toEqual(
        expect.objectContaining({
          userId: undefined,
          userAgent: undefined,
        }),
      );
    });

    it("should handle empty headers", () => {
      // Arrange
      mockRequest.headers = {};

      // Act
      const result = ControllerLoggerPresenter.metadata(
        [mockRequest, mockResponse],
        mockTarget,
        "testMethod",
        "TEST_EVENT",
      );

      // Assert
      expect(result).toEqual(
        expect.objectContaining({
          userId: undefined,
          userAgent: undefined,
        }),
      );
    });

    it("should handle undefined request properties", () => {
      // Arrange
      mockRequest = {
        headers: {},
        baseUrl: undefined,
        get ip() {
          return undefined;
        },
        body: undefined,
        params: undefined,
        query: undefined,
      } as unknown as Request;

      // Act
      const result = ControllerLoggerPresenter.metadata(
        [mockRequest, mockResponse],
        mockTarget,
        "testMethod",
        "TEST_EVENT",
      );

      // Assert
      expect(result).toEqual(
        expect.objectContaining({
          path: undefined,
          ip: undefined,
          requestBody: undefined,
          requestParams: undefined,
          requestQuery: undefined,
        }),
      );
    });

    it("should handle complex request body", () => {
      // Arrange
      const complexBody = {
        array: [1, 2, 3],
        nested: {
          prop: "value",
        },
      };
      const reqWithComplexBody = {
        ...mockRequest,
        body: complexBody,
      };

      // Act
      const result = ControllerLoggerPresenter.metadata(
        [reqWithComplexBody, mockResponse],
        mockTarget,
        "testMethod",
        "TEST_EVENT",
      );

      // Assert
      expect(result.requestBody).toEqual(complexBody);
    });

    it("should handle target with missing constructor.name", () => {
      // Arrange
      mockTarget = {
        constructor: {}, // construtor sem a propriedade name
      };

      // Act
      const result = ControllerLoggerPresenter.metadata(
        [mockRequest, mockResponse],
        mockTarget,
        "testMethod",
        "TEST_EVENT",
      );

      // Assert
      expect(result).toEqual(
        expect.objectContaining({
          controller: undefined,
        }),
      );
    });

    it("should handle empty event string", () => {
      // Act
      const result = ControllerLoggerPresenter.metadata(
        [mockRequest, mockResponse],
        mockTarget,
        "testMethod",
        "",
      );

      // Assert
      expect(result.event).toBe("");
    });

    it("should throw when target is undefined", () => {
      // Act & Assert
      expect(() =>
        ControllerLoggerPresenter.metadata(
          [mockRequest, mockResponse],
          undefined,
          "testMethod",
          "TEST_EVENT",
        ),
      ).toThrow();
    });

    it("should handle minimal request object", () => {
      // Arrange
      const minimalRequest = {
        headers: {},
        baseUrl: undefined,
        get ip() {
          return undefined;
        },
        body: undefined,
        params: undefined,
        query: undefined,
      } as unknown as Request;

      // Act
      const result = ControllerLoggerPresenter.metadata(
        [minimalRequest, mockResponse],
        mockTarget,
        "testMethod",
        "TEST_EVENT",
      );

      // Assert
      expect(result).toEqual(
        expect.objectContaining({
          path: undefined,
          ip: undefined,
          userId: undefined,
          userAgent: undefined,
          requestBody: undefined,
          requestParams: undefined,
          requestQuery: undefined,
        }),
      );
    });

    it("should throw when request arguments are missing", () => {
      // Act & Assert
      expect(() =>
        ControllerLoggerPresenter.metadata(
          [],
          mockTarget,
          "testMethod",
          "TEST_EVENT",
        ),
      ).toThrow();
    });
  });
});
