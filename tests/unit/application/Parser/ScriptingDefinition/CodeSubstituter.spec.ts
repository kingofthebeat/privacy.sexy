import 'mocha';
import { expect } from 'chai';
import { CodeSubstituter } from '@/application/Parser/ScriptingDefinition/CodeSubstituter';
import { IExpressionsCompiler } from '@/application/Parser/Script/Compiler/Expressions/IExpressionsCompiler';
import { ProjectInformationStub } from '@tests/unit/stubs/ProjectInformationStub';
import { ExpressionsCompilerStub } from '@tests/unit/stubs/ExpressionsCompilerStub';

describe('CodeSubstituter', () => {
    describe('throws with invalid parameters', () => {
        // arrange
        const testCases = [{
                expectedError: 'undefined code',
                parameters: {
                    code: undefined,
                    info: new ProjectInformationStub(),
            }},
            {
                expectedError: 'undefined info',
                parameters: {
                    code: 'non empty code',
                    info: undefined,
            },
        }];
        for (const testCase of testCases) {
            it(`throws "${testCase.expectedError}" as expected`, () => {
                const sut = new CodeSubstituterBuilder().build();
                // act
                const act = () => sut.substitute(testCase.parameters.code, testCase.parameters.info);
                // assert
                expect(act).to.throw(testCase.expectedError);
            });
        }
    });
    describe('substitutes parameters as expected values', () => {
        // arrange
        const info = new ProjectInformationStub();
        const date = new Date();
        const testCases = [
            {
                parameter: 'homepage',
                argument: info.homepage,
            },
            {
                parameter: 'version',
                argument: info.version,
            },
            {
                parameter: 'date',
                argument: date.toUTCString(),
            },
        ];
        for (const testCase of testCases) {
            it(`substitutes ${testCase.parameter} as expected`, () => {
                const compilerStub = new ExpressionsCompilerStub();
                const sut = new CodeSubstituterBuilder()
                    .withCompiler(compilerStub)
                    .withDate(date)
                    .build();
                // act
                sut.substitute('non empty code', info);
                // assert
                expect(compilerStub.callHistory).to.have.lengthOf(1);
                const parameters = compilerStub.callHistory[0].parameters;
                expect(parameters.hasArgument(testCase.parameter));
                const argumentValue = parameters.getArgument(testCase.parameter).argumentValue;
                expect(argumentValue).to.equal(testCase.argument);
            });
        }
    });
    it('returns code as it is', () => {
        // arrange
        const expected = 'expected-code';
        const compilerStub = new ExpressionsCompilerStub();
        const sut = new CodeSubstituterBuilder()
            .withCompiler(compilerStub)
            .build();
        // act
        sut.substitute(expected, new ProjectInformationStub());
        // assert
        expect(compilerStub.callHistory).to.have.lengthOf(1);
        expect(compilerStub.callHistory[0].code).to.equal(expected);
    });
});

class CodeSubstituterBuilder {
    private compiler: IExpressionsCompiler = new ExpressionsCompilerStub();
    private date = new Date();
    public withCompiler(compiler: IExpressionsCompiler) {
        this.compiler = compiler;
        return this;
    }
    public withDate(date: Date) {
        this.date = date;
        return this;
    }
    public build() {
        return new CodeSubstituter(this.compiler, this.date);
    }
}
