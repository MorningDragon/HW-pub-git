// ���� ifdef ���Ǵ���ʹ�� DLL �������򵥵�
// ��ı�׼�������� DLL �е������ļ��������������϶���� TESTDLL_EXPORTS
// ���ű���ġ���ʹ�ô� DLL ��
// �κ�������Ŀ�ϲ�Ӧ����˷��š�������Դ�ļ��а������ļ����κ�������Ŀ���Ὣ
// TESTDLL_API ������Ϊ�Ǵ� DLL ����ģ����� DLL ���ô˺궨���
// ������Ϊ�Ǳ������ġ�
#ifdef TESTDLL_EXPORTS
#define TESTDLL_API __declspec(dllexport)
#else
#define TESTDLL_API __declspec(dllimport)
#endif
#include<iostream>
#include<sstream>
#include<cmath>

typedef unsigned long long int  uint64_t;
using namespace std;
extern "C"
{	typedef struct rect_LB_double{
	double m_l;
	double m_b;
	double w;
	double h;
}rectLBf;
TESTDLL_API double calculateDis(char c[],char c2[],double a,double b);//������������С��Ԫ���ԣ�����ֵΪ���������
TESTDLL_API	double calculateAng(char c[],char c2[],double a,double b);//����ֵΪ����
TESTDLL_API char *gridC(char ch[]);//����ֵΪ�ַ�������ָ��

TESTDLL_API uint64_t mortonEncode_LUT(unsigned int x,unsigned int y);
TESTDLL_API uint64_t LB2MortonRegion_wNEh_BIN(const rectLBf& rect,double L,double B,int level);
TESTDLL_API char * LB2MortonRegion_wNEh_QUA(const rectLBf& rect,double L,double B,int level);
TESTDLL_API char * testLB2MortonRegion_wNEh(double ml,double mb,double rw,double rh,double l,double b,int level);//ml��mb�Ǿֲ����Ͻǵľ�γ�� rw��rbΪ������γ�仯�Ĵ�С l��bΪ����ľ�γ�� levelΪ�ʷֵĲ��
}

